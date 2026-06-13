# mysite-backend

Portable deployment bundle for the MatrixSite Node backend (`my-site/server/index.js`).
The Linux box typically also runs MariaDB and the Minecraft server with the
MatrixStats Bukkit plugin, which together provide auth and game data.

## Suggested Linux layout

- `/srv/mysite-backend` - this folder
- `/srv/mysite-backend/my-site.env` - runtime environment file (not in git)
- `/srv/mysite-backend/server/` - copy of `my-site/server/` from the repo
- `/srv/mysite-backend/start.sh` - manual start script and systemd entrypoint
- `/etc/matrixstats/auth-shim-cert.pem` - PEM exported by the Bukkit plugin

## Deploy steps

1. Copy this folder to the Linux machine.
2. Copy `../my-site/server/` next to it so `start.sh` finds `server/index.js`.
3. Rename `my-site.env.example` to `my-site.env` and fill in:
   - MariaDB host / user / password / database
   - `JWT_SECRET`, `ADMIN_USERS`, `CORS_ORIGINS`, `FRONTEND_ORIGIN`
   - `AUTHME_SHIM_SECRET` (copy from `plugins/MatrixStats/config.yml` on the MC server)
   - `AUTHME_SHIM_CA_PATH` (path to a copy of `plugins/MatrixStats/auth-shim-cert.pem`)
4. Install Node.js (>= 20) and MariaDB on the Linux machine.
5. `chmod +x start.sh`.
6. `cp systemd/mysite-backend.service /etc/systemd/system/` and `systemctl enable --now mysite-backend`.
7. (Optional) Place `nginx/backend.conf.example` into your nginx config and reload.

## Auth wiring

When `AUTH_PROVIDER=authme`, every login and change-password call goes:

```
browser -> mysite-backend (Node) --HTTPS+shared-secret--> MatrixStats plugin (Bukkit)
                                                         -> AuthMe Java API
```

The plugin auto-generates a self-signed PKCS12 keystore and exports
`auth-shim-cert.pem` on first start. The Node backend trusts that single PEM
file via `AUTHME_SHIM_CA_PATH`. Rotate the shared secret with
`/matrixstats regen-secret` in-game; rotate the cert with `/matrixstats regen-cert`.

When `AUTH_PROVIDER=matrix_logins`, no plugin is involved - the backend reads
its own bcrypt hashes from `MATRIX_TABLE`.

## Notes

- `start.sh` loads `my-site.env`, then `exec`s `node server/index.js`.
- The backend should run on the same Linux machine as MariaDB when
  `MYSQL_HOST=127.0.0.1`, and should also be co-located with the Minecraft
  server (or on the same trusted network) so the AuthMe shim stays on loopback.
- `CORS_ORIGINS` and `FRONTEND_ORIGIN` control which frontend hosts are
  allowed to send cookies.
