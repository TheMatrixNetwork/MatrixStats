import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import https from "node:https";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

dotenv.config();
try {
  const cwd = process.cwd();
  const parentEnv = path.resolve(cwd, "..", "my-site.env");
  const localEnv = path.resolve(cwd, "my-site.env");
  if (fs.existsSync(parentEnv)) dotenv.config({ path: parentEnv, override: true });
  if (fs.existsSync(localEnv)) dotenv.config({ path: localEnv, override: true });
} catch {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 8787);
const JWT_SECRET = process.env.JWT_SECRET || "dev-change-this";
const SESSION_TTL_MINUTES = Number(process.env.SESSION_TTL_MINUTES || 60);
const REMEMBER_TTL_DAYS = Number(process.env.REMEMBER_TTL_DAYS || 7);

const COOKIE_SAMESITE = String(
  process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === "production" ? "none" : "lax")
).toLowerCase();
const COOKIE_SECURE = String(
  process.env.COOKIE_SECURE || (COOKIE_SAMESITE === "none" ? "1" : "0")
) === "1";

const AUTH_PROVIDER = (process.env.AUTH_PROVIDER || "authme").toLowerCase();

// AuthMe shim: the MatrixStats Bukkit plugin exposes HTTPS endpoints that
// wrap AuthMe's Java API (which is the only supported way to verify AuthMe
// passwords). The Node backend delegates to it for AUTH_PROVIDER=authme.
const AUTHME_SHIM_URL = (process.env.AUTHME_SHIM_URL || "https://127.0.0.1:8081").replace(/\/$/, "");
const AUTHME_SHIM_SECRET = process.env.AUTHME_SHIM_SECRET || "";
const AUTHME_SHIM_CA_PATH = process.env.AUTHME_SHIM_CA_PATH || "";
const AUTHME_SHIM_INSECURE = String(process.env.AUTHME_SHIM_INSECURE || "0") === "1";
const AUTHME_SHIM_TIMEOUT_MS = Number(process.env.AUTHME_SHIM_TIMEOUT_MS || 6000);

let authmeShimAgent = null;
function getAuthmeShimAgent() {
  if (authmeShimAgent) return authmeShimAgent;
  const options = { keepAlive: true };
  if (AUTHME_SHIM_INSECURE) {
    options.rejectUnauthorized = false;
  } else if (AUTHME_SHIM_CA_PATH) {
    try {
      options.ca = fs.readFileSync(AUTHME_SHIM_CA_PATH);
    } catch (err) {
      console.error(`Failed to read AUTHME_SHIM_CA_PATH (${AUTHME_SHIM_CA_PATH}):`, err.message);
    }
  }
  authmeShimAgent = new https.Agent(options);
  return authmeShimAgent;
}

async function callAuthmeShim(pathname, payload) {
  if (!AUTHME_SHIM_SECRET) {
    throw new Error("AUTHME_SHIM_SECRET is not configured");
  }
  const target = new URL(`${AUTHME_SHIM_URL}${pathname}`);
  if (target.protocol !== "https:") {
    throw new Error(`AUTHME_SHIM_URL must use https (got ${target.protocol})`);
  }
  const body = Buffer.from(JSON.stringify(payload || {}), "utf8");

  return await new Promise((resolve, reject) => {
    const request = https.request(
      {
        method: "POST",
        host: target.hostname,
        port: target.port || 443,
        path: target.pathname + (target.search || ""),
        headers: {
          "content-type": "application/json",
          "content-length": body.length,
          "x-auth-shim-secret": AUTHME_SHIM_SECRET,
        },
        agent: getAuthmeShimAgent(),
        timeout: AUTHME_SHIM_TIMEOUT_MS,
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let parsed = {};
          try {
            parsed = text ? JSON.parse(text) : {};
          } catch {
            parsed = { raw: text };
          }
          resolve({ status: response.statusCode || 0, body: parsed });
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error("authme shim request timed out"));
    });
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}
const MATRIX_TABLE = safeSqlId(process.env.MATRIX_TABLE || "matrix_logins", "matrix_logins");
const MATRIX_USER_COLUMN = safeSqlId(process.env.MATRIX_USER_COLUMN || "username", "username");
const MATRIX_PASS_COLUMN = safeSqlId(process.env.MATRIX_PASS_COLUMN || "password_hash", "password_hash");
const ADMIN_USERS = new Set(
  (process.env.ADMIN_USERS || "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean)
);

const LP_PLAYERS_TABLE = safeSqlId(process.env.LP_PLAYERS_TABLE || "luckperms_players", "luckperms_players");
const BQ_QUESTS_TABLE = safeSqlId(process.env.BQ_QUESTS_TABLE || "bq_player_quests", "bq_player_quests");
const BQ_PROVIDER = process.env.BQ_PROVIDER || "beautyquests:players";

const DB_DRIVER = (process.env.DB_DRIVER || "mariadb").toLowerCase();
const SQLITE_PATH = process.env.SQLITE_PATH || path.join(__dirname, "data", "wiki", "wiki.db");
let db;

function normalizeOrigin(origin) {
  if (!origin) return "";
  return String(origin).trim().replace(/\/$/, "");
}

const CORS_ORIGINS = (process.env.CORS_ORIGINS || process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = normalizeOrigin(origin);
      if (!origin || CORS_ORIGINS.length === 0 || CORS_ORIGINS.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const wikiPath = path.join(__dirname, "data", "wiki", "pages.json");
const wikiCache = { mtimeMs: 0, data: null };

function safeSqlId(value, fallback) {
  if (!value) return fallback;
  return /^[a-zA-Z0-9_]+$/.test(value) ? value : fallback;
}

async function loadWikiData() {
  const stat = await fs.promises.stat(wikiPath);
  if (!wikiCache.data || wikiCache.mtimeMs !== stat.mtimeMs) {
    const raw = await fs.promises.readFile(wikiPath, "utf8");
    wikiCache.data = JSON.parse(raw);
    wikiCache.mtimeMs = stat.mtimeMs;
  }
  return wikiCache.data;
}

async function createDatabase() {
  if (DB_DRIVER === "sqlite") {
    const sqliteDb = await open({ filename: SQLITE_PATH, driver: sqlite3.Database });
    await sqliteDb.exec("PRAGMA foreign_keys = ON;");
    return {
      driver: "sqlite",
      query: (sql, params = []) => sqliteDb.all(sql, params),
      exec: (sql) => sqliteDb.exec(sql),
    };
  }

  const mysqlUrl = process.env.MYSQL_URL;
  const pool = mysqlUrl
    ? mysql.createPool(mysqlUrl)
    : mysql.createPool({
        host: process.env.MYSQL_HOST || "localhost",
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "minecraft",
        connectionLimit: 10,
      });

  return {
    driver: "mariadb",
    query: async (sql, params = []) => {
      const [rows] = await pool.query(sql, params);
      return rows;
    },
    exec: (sql) => pool.query(sql),
  };
}

function issueSessionCookie(res, username, rememberMe = false) {
  const expiresIn = rememberMe ? `${REMEMBER_TTL_DAYS}d` : `${SESSION_TTL_MINUTES}m`;
  const token = jwt.sign({ sub: username }, JWT_SECRET, { expiresIn });
  const maxAge = rememberMe
    ? REMEMBER_TTL_DAYS * 24 * 60 * 60 * 1000
    : SESSION_TTL_MINUTES * 60 * 1000;

  res.cookie("sid", token, {
    httpOnly: true,
    sameSite: COOKIE_SAMESITE,
    secure: COOKIE_SECURE,
    path: "/",
    maxAge,
  });
}

function readSession(req) {
  const token = req.cookies?.sid;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload?.sub || null;
  } catch {
    return null;
  }
}

function isAdminUser(username) {
  if (!username) return false;
  return ADMIN_USERS.has(String(username).toLowerCase());
}

function requireAdmin(req, res) {
  const username = readSession(req);
  if (!username || !isAdminUser(username)) {
    res.status(403).json({ message: "Admin access required." });
    return null;
  }
  return username;
}

async function initDb() {
  if (db.driver === "sqlite") {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS wiki_player_flags (
        username TEXT NOT NULL,
        flag TEXT NOT NULL,
        value TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (username, flag)
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS wiki_player_items (
        username TEXT NOT NULL,
        item_id TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (username, item_id)
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS wiki_player_bosses (
        username TEXT NOT NULL,
        boss_id TEXT NOT NULL,
        defeated_at TEXT NULL,
        PRIMARY KEY (username, boss_id)
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS ${MATRIX_TABLE} (
        ${MATRIX_USER_COLUMN} TEXT NOT NULL PRIMARY KEY,
        ${MATRIX_PASS_COLUMN} TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return;
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wiki_player_flags (
      username VARCHAR(64) NOT NULL,
      flag VARCHAR(64) NOT NULL,
      value VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (username, flag)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wiki_player_items (
      username VARCHAR(64) NOT NULL,
      item_id VARCHAR(64) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (username, item_id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS wiki_player_bosses (
      username VARCHAR(64) NOT NULL,
      boss_id VARCHAR(64) NOT NULL,
      defeated_at TIMESTAMP NULL,
      PRIMARY KEY (username, boss_id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ${MATRIX_TABLE} (
      ${MATRIX_USER_COLUMN} VARCHAR(64) NOT NULL PRIMARY KEY,
      ${MATRIX_PASS_COLUMN} VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function verifyAuthmeViaShim(username, password) {
  try {
    const { status, body } = await callAuthmeShim("/verify", { username, password });
    if (status === 200 && body?.ok === true) return true;
    if (status === 200) return false;
    console.warn(`AuthMe shim verify returned status ${status}`, body);
    return false;
  } catch (err) {
    console.error("AuthMe shim verify call failed", err);
    return false;
  }
}

async function changeAuthmePasswordViaShim(username, currentPassword, newPassword) {
  try {
    const { status, body } = await callAuthmeShim("/change-password", {
      username,
      currentPassword,
      newPassword,
    });
    return { status, body };
  } catch (err) {
    console.error("AuthMe shim change-password call failed", err);
    return { status: 502, body: { ok: false, error: "shim_unreachable" } };
  }
}

async function verifyMatrixPassword(plain, storedHash) {
  if (!storedHash) return false;
  return bcrypt.compare(plain, storedHash);
}

// UUID cache: username (lowercase) → Minecraft UUID string.
// UUIDs are permanent so we cache for the server's lifetime.
const uuidCache = new Map();

async function getPlayerUuid(username) {
  const key = username.toLowerCase();
  if (uuidCache.has(key)) return uuidCache.get(key);
  try {
    const rows = await db.query(
      `SELECT uuid FROM ${LP_PLAYERS_TABLE} WHERE LOWER(username) = LOWER(?) LIMIT 1`,
      [username]
    );
    const uuid = rows?.[0]?.uuid || null;
    if (uuid) uuidCache.set(key, uuid);
    return uuid;
  } catch {
    return null;
  }
}

async function getQuestStates(uuid) {
  if (!uuid) return {};
  try {
    const rows = await db.query(
      `SELECT quest_id, state, finished FROM ${BQ_QUESTS_TABLE} WHERE quester_provider = ? AND quester_identifier = ?`,
      [BQ_PROVIDER, uuid]
    );
    const result = {};
    for (const row of rows) {
      result[Number(row.quest_id)] = { state: row.state, finished: Number(row.finished) };
    }
    return result;
  } catch {
    return {};
  }
}

async function getProgress(username) {
  const flagsRows = await db.query(
    "SELECT flag, value FROM wiki_player_flags WHERE username = ?",
    [username]
  );
  const itemsRows = await db.query(
    "SELECT item_id, quantity FROM wiki_player_items WHERE username = ?",
    [username]
  );
  const bossRows = await db.query(
    "SELECT boss_id FROM wiki_player_bosses WHERE username = ?",
    [username]
  );

  const flags = Object.fromEntries(flagsRows.map((row) => [row.flag, row.value]));
  const items = Object.fromEntries(itemsRows.map((row) => [row.item_id, Number(row.quantity)]));
  const bosses = new Set(bossRows.map((row) => row.boss_id));

  const uuid = await getPlayerUuid(username);
  const quests = await getQuestStates(uuid);

  return { flags, items, bosses, quests };
}

function conditionMet(condition, progress) {
  if (!condition) return true;
  if (condition.all) return condition.all.every((item) => conditionMet(item, progress));
  if (condition.any) return condition.any.some((item) => conditionMet(item, progress));
  if (condition.not) return !conditionMet(condition.not, progress);

  if (condition.type === "boss") {
    return progress.bosses.has(condition.id);
  }
  if (condition.type === "item") {
    const quantity = Number(condition.quantity || 1);
    return (progress.items[condition.id] || 0) >= quantity;
  }
  if (condition.type === "flag") {
    const value = progress.flags[condition.id];
    return condition.value ? String(value) === String(condition.value) : Boolean(value);
  }
  if (condition.type === "quest") {
    const questData = progress.quests?.[Number(condition.questId)];
    const status = condition.status || "finished";
    if (status === "finished") return (questData?.finished || 0) >= 1;
    if (status === "started") return questData != null && questData.state !== "NOT_STARTED";
    if (status === "in_progress") {
      return questData != null && ["IN_REGULAR_STAGE", "IN_ENDING_STAGES", "IN_END"].includes(questData.state);
    }
    if (status === "not_started") return !questData || questData.state === "NOT_STARTED";
    // Exact state string match fallback (e.g. "IN_REGULAR_STAGE")
    return questData?.state === status;
  }
  return false;
}

function applyVisibility(page, progress, forceUnlocked = false) {
  const allowed = forceUnlocked || conditionMet(page.requires, progress);
  if (!allowed) {
    return {
      slug: page.slug,
      title: page.title,
      summary: page.summary,
      tags: page.tags,
      icon: page.icon || "",
      bosses: [],
      items: [],
      requires: page.requires || null,
      locked: true,
    };
  }

  const sections = (page.sections || []).map((section) => {
    const sectionAllowed = forceUnlocked || conditionMet(section.requires, progress);
    return {
      id: section.id,
      title: section.title,
      requires: section.requires || null,
      locked: !sectionAllowed,
      bossId: sectionAllowed ? section.bossId || null : null,
      itemId: sectionAllowed ? section.itemId || null : null,
      content: sectionAllowed ? section.content || [] : [],
      list: sectionAllowed ? section.list || [] : [],
      contentMarkdown: sectionAllowed
        ? section.contentMarkdown || section.content_markdown || ""
        : "",
    };
  });

  return {
    slug: page.slug,
    title: page.title,
    summary: page.summary,
    tags: page.tags,
    icon: page.icon || "",
    bosses: page.bosses || [],
    items: page.items || [],
    requires: page.requires || null,
    locked: false,
    sections,
  };
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/server/status", async (req, res) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch("https://api.mcsrvstat.us/3/matrixnetwork.org", {
      headers: {
        accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      res.status(502).json({ message: "Failed to load server status." });
      return;
    }

    const data = await response.json();
    res.json({
      online: Boolean(data?.online),
      playersOnline: Number(data?.players?.online || 0),
      playersMax: Number(data?.players?.max || 0),
      version: data?.version || "Unknown",
      hostname: data?.hostname || "matrixnetwork.org",
      motd: Array.isArray(data?.motd?.clean) ? data.motd.clean.join("\n") : "",
    });
  } catch (err) {
    console.error("Failed to load server status", err);
    res.status(502).json({ message: "Failed to load server status." });
  } finally {
    clearTimeout(timeout);
  }
});

app.get("/api/session", async (req, res) => {
  const username = readSession(req);
  if (!username) {
    res.json({ success: false });
    return;
  }
  res.json({ success: true, user: username, isAdmin: isAdminUser(username) });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password, remember } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    if (AUTH_PROVIDER === "matrix_logins") {
      const rows = await db.query(
        `SELECT ${MATRIX_USER_COLUMN} AS username, ${MATRIX_PASS_COLUMN} AS password
         FROM ${MATRIX_TABLE}
         WHERE LOWER(${MATRIX_USER_COLUMN}) = LOWER(?)
         LIMIT 1`,
        [username]
      );
      const record = rows?.[0];
      if (!record) {
        res.status(401).json({ message: "Invalid username or password." });
        return;
      }

      const ok = await verifyMatrixPassword(password, record.password);
      if (!ok) {
        res.status(401).json({ message: "Invalid username or password." });
        return;
      }

      issueSessionCookie(res, record.username, Boolean(remember));
      res.json({ success: true, user: record.username, isAdmin: isAdminUser(record.username) });
      return;
    }

    const ok = await verifyAuthmeViaShim(username, password);
    if (!ok) {
      res.status(401).json({ message: "Invalid username or password." });
      return;
    }

    issueSessionCookie(res, username, Boolean(remember));
    res.json({ success: true, user: username, isAdmin: isAdminUser(username) });
  } catch (err) {
    console.error("Login failed", err);
    res.status(500).json({ message: "Login failed." });
  }
});

app.post("/api/auth/change-password", async (req, res) => {
  const sessionUser = readSession(req);
  if (!sessionUser) {
    res.status(401).json({ message: "Not logged in." });
    return;
  }
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: "currentPassword and newPassword are required." });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ message: "New password must be at least 6 characters." });
    return;
  }

  if (AUTH_PROVIDER === "matrix_logins") {
    try {
      const rows = await db.query(
        `SELECT ${MATRIX_USER_COLUMN} AS username, ${MATRIX_PASS_COLUMN} AS password
         FROM ${MATRIX_TABLE}
         WHERE LOWER(${MATRIX_USER_COLUMN}) = LOWER(?)
         LIMIT 1`,
        [sessionUser]
      );
      const record = rows?.[0];
      if (!record || !(await verifyMatrixPassword(currentPassword, record.password))) {
        res.status(401).json({ message: "Current password is incorrect." });
        return;
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      await db.query(
        `UPDATE ${MATRIX_TABLE} SET ${MATRIX_PASS_COLUMN} = ? WHERE LOWER(${MATRIX_USER_COLUMN}) = LOWER(?)`,
        [newHash, sessionUser]
      );
      res.json({ success: true });
      return;
    } catch (err) {
      console.error("change-password (matrix) failed", err);
      res.status(500).json({ message: "Change password failed." });
      return;
    }
  }

  const { status, body } = await changeAuthmePasswordViaShim(sessionUser, currentPassword, newPassword);
  if (status === 200 && body?.ok === true) {
    res.json({ success: true });
    return;
  }
  if (status === 401 || body?.error === "bad_current_password") {
    res.status(401).json({ message: "Current password is incorrect." });
    return;
  }
  if (status === 404 || body?.error === "not_registered") {
    res.status(404).json({ message: "Account not registered." });
    return;
  }
  console.warn("change-password shim returned", status, body);
  res.status(502).json({ message: "Change password failed." });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("sid", {
    httpOnly: true,
    sameSite: COOKIE_SAMESITE,
    secure: COOKIE_SECURE,
    path: "/",
  });
  res.json({ success: true });
});

app.get("/api/wiki/pages", async (req, res) => {
  try {
    const username = readSession(req);
    if (!username) {
      res.status(401).json({ message: "Login required." });
      return;
    }
    const forceUnlocked = req.query.view === "all" && isAdminUser(username);
    const progress = username ? await getProgress(username) : { flags: {}, items: {}, bosses: new Set(), quests: {} };
    const data = await loadWikiData();
    const pages = (data.pages || []).map((page) => {
      const allowed = forceUnlocked || conditionMet(page.requires, progress);
      return {
        slug: page.slug,
        title: page.title,
        summary: page.summary,
        tags: page.tags || [],
        icon: page.icon || "",
        requires: page.requires || null,
        locked: !allowed,
      };
    });
    res.json({ pages });
  } catch (err) {
    console.error("Failed to load pages", err);
    res.status(500).json({ message: "Failed to load pages." });
  }
});

app.get("/api/wiki/page/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const username = readSession(req);
    if (!username) {
      res.status(401).json({ message: "Login required." });
      return;
    }
    const forceUnlocked = req.query.view === "all" && isAdminUser(username);
    const progress = username ? await getProgress(username) : { flags: {}, items: {}, bosses: new Set(), quests: {} };
    const data = await loadWikiData();
    const page = (data.pages || []).find((entry) => entry.slug === slug);
    if (!page) {
      res.status(404).json({ message: "Entry not found." });
      return;
    }
    res.json(applyVisibility(page, progress, forceUnlocked));
  } catch (err) {
    console.error("Failed to load page", err);
    res.status(500).json({ message: "Failed to load page." });
  }
});

app.get("/api/player/progress", async (req, res) => {
  const username = readSession(req);
  if (!username) {
    res.status(401).json({ message: "Not logged in." });
    return;
  }
  try {
    const progress = await getProgress(username);
    const items = Object.entries(progress.items).map(([id, qty]) => `${id} x${qty}`);
    const flags = Object.entries(progress.flags).map(([id, value]) => `${id}: ${value}`);
    res.json({
      bosses: Array.from(progress.bosses),
      items,
      flags,
    });
  } catch (err) {
    console.error("Failed to load progress", err);
    res.status(500).json({ message: "Failed to load progress." });
  }
});

app.get("/api/admin/wiki/pages", async (req, res) => {
  const username = requireAdmin(req, res);
  if (!username) return;
  try {
    const data = await loadWikiData();
    res.json(data);
  } catch (err) {
    console.error("Failed to load admin wiki data", err);
    res.status(500).json({ message: "Failed to load wiki data." });
  }
});

app.put("/api/admin/wiki/pages", async (req, res) => {
  const username = requireAdmin(req, res);
  if (!username) return;

  const payload = req.body;
  if (!payload || !Array.isArray(payload.pages)) {
    res.status(400).json({ message: "Expected { pages: [] }." });
    return;
  }

  try {
    await fs.promises.writeFile(wikiPath, JSON.stringify(payload, null, 2));
    wikiCache.data = payload;
    wikiCache.mtimeMs = Date.now();
    res.json(payload);
  } catch (err) {
    console.error("Failed to save wiki data", err);
    res.status(500).json({ message: "Failed to save wiki data." });
  }
});

async function startServer() {
  db = await createDatabase();
  await initDb();
  app.listen(PORT, () => {
    console.log(`Wiki server running on ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to init db", err);
  process.exit(1);
});
