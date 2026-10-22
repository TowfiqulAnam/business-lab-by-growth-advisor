# Activate secure accounts and private Sheet delivery

The frontend is still the single `index.html`. The SQL migration and Edge Function run on Supabase; they must never be copied into a browser script. Cloud services are **prepared, not deployed**. Local simulation, planners, dues, reports and downloads work immediately.

## 1. Owner-controlled project

Create or select a project at https://supabase.com/dashboard. Keep its database password private. Select a region suitable for your visitors. Do not put a database password, service-role key or Google key in GitHub or chat. This repository contains no private credentials.

In the SQL editor, run `migrations/202610220001_private_workspace.sql` once. It creates:

- `workspaces`: one JSON workspace per authenticated user. RLS permits only the owner to read it. The save RPC derives ownership from the verified session and rejects stale revision writes.
- `consultation_leads`: no browser read/list/write privileges. Only the server function can accept requests. A database transaction limits intake to five new requests per verified user per hour.

## 2. Email-code sign-in

Enable Email authentication. Set the Magic Link email template to include `{{ .Token }}` so it sends a verification code; the app uses `signInWithOtp` followed by `verifyOtp` with type `email`. Configure your own SMTP sender before inviting public users: Supabase's default mail service is restricted and is not a public production mail setup. Review email rate limits in the dashboard. Test both first-time signup and returning-user login.

Set your HTTPS site URL in Auth settings. The app uses typed codes, not redirect links. Users can play as guests, then sign in and choose **Save this workspace online**. On another device, sign in and choose **Load my cloud workspace**. Saves are explicit; they are not background synchronization. Local autosave remains unchanged. Sign-out clears business data on this browser; shared-device users should sign out.

## 3. Google Sheet access (owner action)

The existing workbook is:
https://docs.google.com/spreadsheets/d/1BCo31StL50LDK6YuNqPwXUcRIVIkACo3SgNS3LfQyoA/edit

A blank `Consultations` tab is prepared with the 28 existing CSV-compatible columns. `Leads` and `Usage` are preserved. No real customer records were seeded.

In an owner-controlled Google Cloud project, enable the Google Sheets API and create a service account. Create a JSON key and store it only in Supabase's encrypted Edge Function secrets. Share this one workbook with that service account's `client_email` as Editor. Do not make the workbook public or enable domain-wide delegation. The app's visitors never receive this credential or permission to read leads.

Set these Edge Function secrets in Supabase:

| Secret | Value |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Complete service-account JSON; private, never commit |
| `GOOGLE_SHEET_ID` | `1BCo31StL50LDK6YuNqPwXUcRIVIkACo3SgNS3LfQyoA` |
| `ALLOWED_ORIGINS` | Exact HTTPS website origin(s), comma-separated, without trailing slash or URL path |

Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in deployed functions. `ALLOWED_ORIGINS` does not include `null`: direct `file://` pages cannot submit private leads. Serve the deployed app over HTTPS. For local development explicitly allow a localhost origin.

## 4. Deploy the function and set public configuration

With the Supabase CLI authenticated to your project:

```sh
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy submit-lead
```

`config.toml` disables the legacy gateway JWT check because the function **explicitly validates every bearer token using Auth getUser** and requires a confirmed email. It does not permit anonymous submission.

In `index.html`, set `CLOUD_CONFIG.url` to your project HTTPS URL and `CLOUD_CONFIG.publishableKey` to its **publishable (or legacy anon) key**. Those two values are public and safe to commit when RLS is installed. Never use a secret/service-role key here. The browser loads the pinned Supabase client only when configuration is present; all other app features remain self-contained.

## 5. Verify before announcing accounts

Local server-handler tests (Node 24+): `node supabase/tests/handler.test.cjs`. These use mocked services and do not replace live RLS, email or Google acceptance tests.

1. Create two test accounts with different emails. Account A saves; B must not read A's row, even when requesting A's user ID directly. B must not call the private lead RPC or list `consultation_leads`.
2. Save and load simulation progress, dated plans, projects, profile and dues across two devices. Save a newer revision in the first device, then try saving stale data in the second: it must reject the overwrite.
3. Submit a consented test consultation. Verify one row in `Consultations`; retry the same form and verify it uses the same row. Use no real customer data for this test.
4. Temporarily misconfigure Sheet access in a test project. Intake should report **saved privately, Sheet delivery pending**, not pretend delivery succeeded. Restore access and retry the same request. The pending private record remains available in the Supabase owner dashboard.
5. Check missing/expired tokens, invalid origins, invalid fields and the hourly intake limit. The browser must receive a safe error without credential or customer-data leakage.
6. Sign out. The device workspace must clear. Verify earlier local guest data was backed up if it was needed before replacement.

## Operations and limitations

- Google Sheet writes use a fixed database-assigned row and `RAW` input. This makes retries idempotent and prevents formula evaluation. **Do not sort, insert or delete physical rows in `Consultations`.** Use another analysis tab or filter views. Keep the raw ingestion tab intact.
- The prepared tab has 10,000 rows. Extend its grid before reaching capacity. Sheet outages do not lose the canonical private database record. Pending delivery currently retries when the same form is resubmitted; no scheduled retry worker is deployed.
- The client keeps the current request ID in memory for retries. Reloading a form starts a new request, so it can create a new consultation. User edits also create a new request.
- Email sign-in and server verification protect account identity; user-entered business and simulation figures are self-reported, not audited or proof of financial performance.
- The app keeps local working copies for offline use. Browser storage is not encrypted; sign out on shared devices. Old V3.0 local lead archives are retained but no longer exposed by the app UI. The owner can export those from the preserved V3.0 version before clearing them.
- Full account deletion, automated pending-delivery retries, multi-user business teams and restore UI are future extensions. A workspace backup is a JSON archive; cloud restore is implemented. Owner-assisted account/data deletion must remove both database and Sheet records.
- No paid plan or new service account has been created automatically. Review provider plans and limits in your own dashboards before production launch.

Official references: [Email OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Google service accounts](https://developers.google.com/identity/protocols/oauth2/service-account), [Sheets values.update](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/update).
