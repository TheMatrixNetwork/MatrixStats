# MatrixStats

The MatrixStats repo now hosts the MatrixSite stack: a React 19 + Vite
frontend, an Express 5 backend, and a slim Bukkit plugin that fronts AuthMe
so passwords can be verified safely from outside the Minecraft server.

## Repo layout

| Path                | What it is                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| `my-site/`          | React + Vite frontend and the Express backend (`my-site/server/index.js`). |
| `mysite-backend/`   | Portable Linux deploy bundle (`start.sh`, systemd unit, nginx example).    |
| `src/main/java/`    | Slim Bukkit plugin: AuthMe HTTPS shim for the Node backend.                |
| `src/main/resources/` | `plugin.yml` and default `config.yml` for the plugin.                    |
| `balance-analysis/` | Class balance CSV / JSON / MD reports.                                     |
| `pom.xml`           | Maven build for the plugin (`mvn package` -> `target/MatrixStats-*.jar`).  |

## Architecture

```
  +----------+        +----------------------+        +--------------------+
  | browser  | -----> | mysite-backend (Node)| -----> | MatrixStats plugin |
  +----------+        |  Express, MariaDB    |  HTTPS |  (Bukkit, AuthMe)  |
       ^              +----------------------+ shared +--------------------+
       |                       |                 secret         |
       |  React (Vite)         | reads wiki / quests / luck     | AuthMe Java API
       +-----------------------+  perms from MariaDB            +---> AuthMe DB
```

AuthMe's password hashing is intentionally hidden behind its Java API, so the
Node backend cannot verify passwords against the `authme` table directly.
Instead, the Bukkit plugin exposes two HTTPS endpoints (`/verify`,
`/change-password`) bound to loopback and protected by a shared secret. The
plugin auto-generates a self-signed PKCS12 keystore on first start and
exports a PEM cert the Node backend pins via `AUTHME_SHIM_CA_PATH`.

## Local development (frontend + backend)

Prereqs: Node.js 20+, MariaDB or SQLite, Java 17 + Maven for the plugin.

```pwsh
cd my-site
cp .env.example .env       # fill in DB creds, JWT_SECRET, AUTHME_SHIM_* if testing auth
npm install
npm run dev                # Vite dev server with /api proxied to :8787

# In another terminal:
node server/index.js       # Express backend on :8787
```

For a fast local loop without a Minecraft server, set `AUTH_PROVIDER=matrix_logins`
and create a row in the `matrix_logins` table (bcrypt password hash).

## Building the plugin

```pwsh
mvn -q -DskipTests package
# Drop target/MatrixStats-2.0.0.jar into your Spigot/Paper server's plugins/ folder.
```

On first start the plugin will:

1. Create `plugins/MatrixStats/config.yml` (if missing).
2. Generate a random shared secret and keystore password.
3. Use `keytool` (bundled with the JDK) to create
   `plugins/MatrixStats/auth-shim-keystore.p12` and export
   `plugins/MatrixStats/auth-shim-cert.pem`.
4. Start an HTTPS server on `127.0.0.1:8081`.

Copy the secret from `config.yml` and the PEM into the backend's `my-site.env`:

```ini
AUTHME_SHIM_URL=https://127.0.0.1:8081
AUTHME_SHIM_SECRET=<value from plugins/MatrixStats/config.yml>
AUTHME_SHIM_CA_PATH=/etc/matrixstats/auth-shim-cert.pem
```

In-game admin commands:

- `/matrixstats reload` - reload config and restart the HTTPS server
- `/matrixstats regen-secret` - rotate the shared secret
- `/matrixstats regen-cert` - regenerate the keystore + PEM

## Production deploy

See `mysite-backend/README.md` and `mysite-backend/DEPLOY-CHECKLIST.txt` for
the full Linux + systemd + nginx workflow.
