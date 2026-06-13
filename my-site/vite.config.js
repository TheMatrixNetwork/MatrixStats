import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

// Load .env first, then my-site.env (parent then local) with override so my-site.env takes precedence
dotenv.config();
try {
  const cwd = process.cwd();
  const parentEnv = path.resolve(cwd, '..', 'my-site.env');
  const localEnv = path.resolve(cwd, 'my-site.env');
  if (fs.existsSync(parentEnv)) dotenv.config({ path: parentEnv, override: true });
  if (fs.existsSync(localEnv)) dotenv.config({ path: localEnv, override: true });
} catch {}

// Dev helper: proxy /api calls to the Express server on 8787 so that
// fetch('/api/...') from the browser hits the backend without needing full URL.
// This fixes issues where relative fetches returned 404 from the Vite dev server,
// causing PayPal createOrder to return no id ("Expected an order id to be passed").
export default defineConfig(({ mode }) => {
  // Vite loads .env.* for the given mode; we also allow process.env (from my-site.env)
  const env = loadEnv(mode, process.cwd(), '');
  const VITE_PAYPAL_CLIENT_ID = env.VITE_PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID || '';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_PAYPAL_CLIENT_ID': JSON.stringify(VITE_PAYPAL_CLIENT_ID),
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
          ws: false,
        },
      },
    },
  };
});
