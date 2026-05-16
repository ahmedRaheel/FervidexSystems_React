# Contact Form Setup

The React app now submits to `/api/contact` instead of using `mailto:` or exposing the inbox address on the page.

## Required Azure Static Web Apps application settings

In Azure Portal > Static Web App > Configuration > Application settings, add:

```txt
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-smtp-login@example.com
SMTP_PASS=your-app-password-or-smtp-password
MAIL_FROM=your-smtp-login@example.com
CONTACT_TO=your-private-receiving-inbox@example.com
```

For your site, set `CONTACT_TO` to your receiving inbox. This value is server-side only and is not visible in the React page.

## Outlook / Microsoft 365 SMTP

Typical settings:

```txt
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
```

If your Microsoft account blocks SMTP username/password authentication, use a Microsoft 365 app password, enable SMTP AUTH for the mailbox, or use another SMTP provider such as Brevo, SendGrid, Mailgun or Resend.

## Local development

Run the React site normally:

```bash
npm install
npm run dev
```

For the API, deploy with Azure Static Web Apps or run Azure Functions locally from the `api` folder with the same environment variables.
