# Skovio Auth Core

React + Vite frontend backed by a Spring Boot REST API, MySQL, BCrypt, JWT, and SMTP email OTP delivery. The existing Day 1 UI is retained; authentication state is now server-backed.

## Run Locally

1. Create the database once, or allow the configured MySQL user to create it:

```sql
CREATE DATABASE skovio_auth;
```

2. Configure backend environment variables from `backend/.env.example`. Spring Boot reads these from the process environment. Set SMTP credentials and a random `JWT_SECRET`; do not commit the real values.

3. Run the backend from `backend/`:

```powershell
mvn spring-boot:run
```

The API listens on `http://localhost:8080`.

4. Copy `.env.example` to `.env` in the repository root and start the frontend:

```powershell
npm install
npm run dev
```

The frontend listens on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/verify-otp` | Public |
| POST | `/api/auth/resend-otp` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/reset-password` | Public |
| GET | `/api/user/me` | Bearer JWT |

OTP values are stored temporarily on the server, expire after five minutes, are rate-limited by cooldown, and are never returned to the browser. Passwords are BCrypt hashes. The frontend stores only the JWT in local storage and clears it on logout.

## Verification

```powershell
npm run build
npm run lint
```

The local shell used for this implementation did not have Maven installed, so backend compilation and live MySQL/SMTP/Postman tests still need to be run in a Java/Maven environment with configured services.
