# Setup on a new account / new chat

1. Import the project (Download ZIP → drop it into a new v0 chat, or connect the GitHub repo).
2. Connect the **Neon** integration. This adds `DATABASE_URL` automatically.
3. In **Settings → Vars**, add:
   - `BETTER_AUTH_SECRET`: any long random string (`openssl rand -base64 32`).
   - `ADMIN_EMAILS` (optional): comma-separated admin emails.
4. Open `/admin/sign-up` and create your account, then sign in at `/admin/sign-in`.

The app creates its tables (`user`, `session`, `account`, `verification`, `bookings`) the first time the server starts. You do not need to run any SQL.

If `ADMIN_EMAILS` is empty, the first account ever created becomes the admin. On a public deployment, set `ADMIN_EMAILS` so nobody else can claim the admin account.
