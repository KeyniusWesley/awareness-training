# Keynius Security Awareness Training App

This project is now a shareable training web app with:

- an admin dashboard
- SQLite storage for invites, attempts, settings, and mail templates
- encrypted storage of Microsoft OAuth values and tokens
- a generic share link that opens the training with only a work email
- a fully public training route with no login or access code
- invite links plus access codes
- locked answers per topic
- pass/fail scoring
- retries until a learner reaches at least 85%
- an overview of who completed it, when, and with what score
- hidden per-question activity logging in SQLite

## Main flow

1. An admin enters an employee email address.
2. The app generates a unique invite link and 6-digit access code.
3. If SMTP is configured, the learner receives the mail automatically.
4. The learner opens the link, enters the code, and completes the topics in order.
5. Answers are locked after each topic is submitted.
6. At the end, the learner gets a score.
7. A learner passes at `85%` or higher.
8. If the learner fails, the app creates a retry flow until they pass.

## Shareable link flow

You can also share a generic training link:

- `http://127.0.0.1:4185/`
- `http://127.0.0.1:4185/share`

With this flow:

1. The learner opens the public training link.
2. The training starts immediately without email or access code.
3. The app creates or resumes an anonymous browser-session attempt.
4. The learner completes the training and gets a score.

The learner does not see the audit trail, but the app stores hidden activity logs for question interactions and topic submissions in SQLite.

## Files

- `server.js` - Express backend, invite logic, scoring, retries, and reporting
- `public/admin.html` - admin dashboard
- `public/admin.js` - admin invite and overview logic
- `public/participant.html` - learner training interface
- `public/participant.js` - learner verification, topic flow, scoring, and retries
- `public/shared.css` - shared Keynius-branded styling
- `assets/brand/` - local Keynius logo assets
- `assets/images/` - topic illustrations
- `app.js` - source of the training topics and question bank used by the server
- `data/app.db` - SQLite database with invites, attempts, templates, and settings
- `public/share.html` - shareable email-only access page
- `public/share.js` - shareable learner flow and hidden activity logging
- `data/encryption.key` - local encryption key used for encrypted settings if `APP_ENCRYPTION_KEY` is not set

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an `.env` file based on `.env.example`.

3. Start the app:

```bash
npm start
```

4. Open the admin dashboard:

```text
http://127.0.0.1:4185/admin
```

5. In the admin dashboard, fill in:
   - Microsoft tenant ID
   - Microsoft client ID
   - redirect URI
   - optional client secret
   - invite email subject and body template

6. Save settings, then click `Connect Microsoft 365`.

## Render deployment

This project includes [render.yaml](/Users/user/Documents/Awareness%20training/render.yaml) for Render Blueprint deployment.

Important:

- the app uses SQLite
- SQLite on Render must use a persistent disk
- without a persistent disk, all invites, attempts, settings, and logs will be lost after restart or redeploy

The included Render config sets:

- `npm install` as build command
- `npm start` as start command
- a persistent disk mounted on `/opt/render/project/src/data`
- generated `APP_ENCRYPTION_KEY`

In Render you still need to set:

- `APP_BASE_URL`
  use your Render service URL, for example `https://awareness-training.onrender.com`

If you use Microsoft 365 OAuth, your Entra redirect URI must match:

- `https://your-render-domain/auth/microsoft/callback`

## SMTP configuration

If SMTP is configured, the system sends the invite email automatically.

If SMTP is not configured yet, the admin dashboard still creates:

- the unique invite link
- the 6-digit code

You can then copy them manually while setting up mail later.

## Microsoft 365 OAuth configuration

If you want to connect your own Microsoft 365 account from the admin dashboard, create an Entra ID app registration and allow delegated Microsoft Graph permissions:

- `Mail.Send`
- `User.Read`
- `openid`
- `profile`
- `email`
- `offline_access`

Add this redirect URI:

```text
http://127.0.0.1:4185/auth/microsoft/callback
```

Then enter the app values in the admin dashboard. They are stored in SQLite, and sensitive values are encrypted before saving.

You can use:

- a confidential web app with a client secret, or
- a PKCE-based setup without a client secret if your Microsoft app is configured for that flow

Once connected, invite emails are sent from your connected mailbox through Microsoft Graph.

## Encrypted settings

The following values are stored encrypted in the database:

- Microsoft tenant ID
- Microsoft client ID
- Microsoft client secret
- Microsoft redirect URI
- Microsoft access token
- Microsoft refresh token
- connected mailbox details

The encryption key comes from:

- `APP_ENCRYPTION_KEY`, if set, or
- `data/encryption.key`, generated automatically on first start

## Overview and audit trail

The admin dashboard shows:

- each invited learner
- status
- attempt count
- last sent date/time
- latest score

It also keeps an attempt log with:

- learner email
- attempt number
- submitted date/time
- score
- pass or retry-required result

Hidden activity logs are stored in the `activity_logs` table in SQLite, including:

- share-link starts
- attempt resume events
- answer selections per question
- finalized answers per question
- topic submissions
- completed attempts

## Pass threshold

- Minimum passing score: `85%`
- Failed learners must retry until they pass

## Internal content basis

The training content is based on:

- `Smart Locking Group security policies v1.2 januari 2025.pdf`
- `Procedure safe use AI v1.0.pdf`
- `Keynius SLG Information security policy v1.5.pdf`
- `Keynius Statement of Applicability v1.1 ENG.pdf`
- `Keynius Security Incident Response Plan v1.0.pdf`
- `Keynius Brand Guidelines.pdf`
