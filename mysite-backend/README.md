# mysite-backend

This folder is a portable backend deployment bundle for the MatrixSite server.

## What to replace

Replace the placeholder values in `my-site.env` with your Linux server details:

- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `JWT_SECRET`
- `ADMIN_USERS`
- `CORS_ORIGINS`
- `FRONTEND_ORIGIN`
- `VITE_API_BASE` in the frontend build, if you are hosting the frontend on a different domain

## Suggested Linux layout

- `/srv/mysite-backend` - app folder
- `/srv/mysite-backend/my-site.env` - runtime environment file
- `/srv/mysite-backend/start.sh` - manual start script and systemd entrypoint
- `node server/index.js` - backend process

## Deploy steps

1. Copy this folder to the Linux machine.
2. Put the app files in the target directory, or copy the app source next to this folder if you are deploying manually.
3. Rename `my-site.env` from the example file and fill in the values.
4. Install Node.js and MariaDB on the Linux machine.
5. Make `start.sh` executable with `chmod +x start.sh`.
6. Enable the systemd service in `systemd/mysite-backend.service`.
6. If you use a reverse proxy, place the nginx config in `nginx/backend.conf.example` into your server block and set your frontend to point at the backend URL.

## Notes

- The backend should run on the same Linux machine as MariaDB when `MYSQL_HOST=127.0.0.1`.
- If the frontend is hosted elsewhere, the browser will call the backend over HTTPS, so `COOKIE_SAMESITE=none` and `COOKIE_SECURE=1` are usually required.
- The backend accepts CORS origins from `CORS_ORIGINS` or `FRONTEND_ORIGIN`.
- `start.sh` loads `my-site.env` and starts the backend directly, so you can use it manually or from systemd.
