# Skovio Auth Core

React + Vite frontend backed by a Spring Boot REST API, MySQL, BCrypt, JWT, and SMTP email OTP delivery. The existing Day 1 UI is retained; authentication state is now server-backed.

## Features

- User registration with email OTP verification and resend
- Login with JWT authentication and protected dashboard access
- Session restoration after page refresh
- Authenticated profile fetch and update
- Logout with local token removal
- Forgot-password and reset-password OTP flow
- Toast notifications and verification feedback

## Tech Stack

- Frontend: React, Vite
- Backend: Spring Boot, Java, Spring Security, JWT
- Database: MySQL with Spring Data JPA
- Email: SMTP via Spring Mail

## Run Locally

1. Create the database once, or allow the configured MySQL user to create it:

```sql
CREATE DATABASE skovio_auth;
```

2. Configure backend environment variables from `backend/.env.example`. Spring Boot reads these from the process environment; copying the file alone does not load it automatically. Set the variables in your shell or IDE launch configuration, including SMTP credentials and a random `JWT_SECRET`.

   Required backend variables are `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `JWT_SECRET`, and `FRONTEND_URL`. Use placeholders only in committed example files.

3. Run the backend from `backend/`:

```powershell
mvn spring-boot:run
```

The API listens on `http://localhost:8080`.

For local OTP testing without a production mail provider, install Mailpit on Windows with `winget`:

```powershell
winget install --id axllent.mailpit --source winget --accept-source-agreements --accept-package-agreements
mailpit
```

Restart PowerShell after installation if `mailpit` is not found on the current `PATH`. Mailpit listens on SMTP `localhost:1025` and its inbox is available at `http://localhost:8025`. Keep the default local mail settings (`MAIL_HOST=localhost`, `MAIL_PORT=1025`), then open the inbox to read OTP messages. For production, configure `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_AUTH`, and `MAIL_STARTTLS` with your SMTP provider.

4. Copy `.env.example` to `.env` in the repository root and start the frontend:

```powershell
npm install
npm run dev
```

The frontend listens on `http://localhost:5173`. To point it at another API, set `VITE_API_URL` in the root `.env` file using the placeholder format in the root `.env.example`.

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
| PUT | `/api/user/me` | Bearer JWT |

OTP values are stored as BCrypt hashes on the server, expire after five minutes, are rate-limited by cooldown, and are never returned to the browser. Passwords are BCrypt hashes. The frontend stores only the JWT in local storage and clears it on logout. Password reset requests use a generic response to reduce account enumeration.

Postman requests are documented in `postman/Skovio-Day3.postman_collection.json`; set its `baseUrl`, `email`, and `otp` variables without adding credentials or secrets to the collection.

## Production Notes

Use a production MySQL instance, SMTP provider, strong randomly generated `JWT_SECRET`, and the deployed frontend origin for `FRONTEND_URL`. Never expose database or SMTP credentials to the React application, and never commit `.env` files, real credentials, `node_modules`, or Maven `target` output.

## Verification

```powershell
npm run build
npm run lint
```

The local shell used for this implementation did not have Maven installed, so backend compilation and live MySQL/SMTP/Postman tests still need to be run in a Java/Maven environment with configured services.
