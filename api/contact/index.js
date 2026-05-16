const nodemailer = require('nodemailer');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers };
    return;
  }

  try {
    const { subject, fields } = req.body || {};

    if (!subject || !fields || !fields.Name || !fields.Email || !fields.Message) {
      context.res = {
        status: 400,
        headers,
        body: { success: false, message: 'Please complete name, email and message.' }
      };
      return;
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.MAIL_FROM || smtpUser;
    const toEmail = process.env.CONTACT_TO;

    if (!smtpHost || !smtpUser || !smtpPass || !toEmail || !fromEmail) {
      context.res = {
        status: 500,
        headers,
        body: {
          success: false,
          message: 'Email service is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM and CONTACT_TO in Azure Static Web Apps application settings.'
        }
      };
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass }
    });

    const rows = Object.entries(fields)
      .filter(([, value]) => String(value || '').trim().length > 0)
      .map(([key, value]) => `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:700;">${escapeHtml(key)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`)
      .join('');

    await transporter.sendMail({
      from: `Fervidex Systems Website <${fromEmail}>`,
      to: toEmail,
      replyTo: fields.Email,
      subject,
      text: Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n'),
      html: `<h2>${escapeHtml(subject)}</h2><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">${rows}</table>`
    });

    context.res = {
      status: 200,
      headers,
      body: { success: true, message: 'Message sent successfully.' }
    };
  } catch (error) {
    context.log.error(error);
    context.res = {
      status: 500,
      headers,
      body: { success: false, message: 'Message could not be sent right now. Please try again later.' }
    };
  }
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
