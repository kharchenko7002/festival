// Email sending via Nodemailer + SMTP environment variables.
// If SMTP_HOST is not set, the function returns { sent: false } without
// throwing, so registration still works when email is not configured.
const nodemailer = require('nodemailer')

function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS,
  )
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Build a plain-text Norwegian Bokmål receipt email for the registrant.
function buildEmailText(reg) {
  return [
    `Takk for påmeldingen, ${reg.navn}!`,
    '',
    'Her er en oppsummering av det du meldte deg på:',
    '',
    `Navn:              ${reg.navn}`,
    `Klasse:            ${reg.klasse}`,
    `E-post:            ${reg.epost}`,
    `Valgt bedrift:     ${reg.bedriftNavn}`,
    `Valgt workshop:    ${reg.workshopTittel}`,
    `Ønsket tidspunkt:  ${reg.tidspunkt}`,
    reg.kommentar ? `Kommentar/behov:   ${reg.kommentar}` : '',
    '',
    `Kvitteringskode: 2INF-${reg.id.slice(-4).toUpperCase()}`,
    '',
    'Dette er en automatisk kvittering fra 2INF Festival.',
    'Ta kontakt med festivalansvarlig hvis noe er feil.',
    '',
    '2INF Festival – Hamar katedralskole',
  ]
    .filter((line) => line !== null)
    .join('\n')
}

function buildEmailHtml(reg) {
  const code = `2INF-${reg.id.slice(-4).toUpperCase()}`
  const kommentarRow = reg.kommentar
    ? `<tr><td style="color:#6b7280;padding:4px 8px 4px 0">Kommentar/behov</td><td style="font-weight:600;padding:4px 0">${reg.kommentar}</td></tr>`
    : ''
  return `
<!DOCTYPE html>
<html lang="nb">
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;color:#1e293b;max-width:560px;margin:0 auto;padding:24px">
  <h2 style="color:#2563eb">Kvittering for påmelding – 2INF Festival</h2>
  <p>Takk for påmeldingen, <strong>${reg.navn}</strong>!</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="color:#6b7280;padding:4px 8px 4px 0">Navn</td><td style="font-weight:600;padding:4px 0">${reg.navn}</td></tr>
    <tr><td style="color:#6b7280;padding:4px 8px 4px 0">Klasse</td><td style="font-weight:600;padding:4px 0">${reg.klasse}</td></tr>
    <tr><td style="color:#6b7280;padding:4px 8px 4px 0">E-post</td><td style="font-weight:600;padding:4px 0">${reg.epost}</td></tr>
    <tr><td style="color:#6b7280;padding:4px 8px 4px 0">Valgt bedrift</td><td style="font-weight:600;padding:4px 0">${reg.bedriftNavn}</td></tr>
    <tr><td style="color:#6b7280;padding:4px 8px 4px 0">Valgt workshop</td><td style="font-weight:600;padding:4px 0">${reg.workshopTittel}</td></tr>
    <tr><td style="color:#6b7280;padding:4px 8px 4px 0">Ønsket tidspunkt</td><td style="font-weight:600;padding:4px 0">${reg.tidspunkt}</td></tr>
    ${kommentarRow}
  </table>
  <p style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;font-size:14px">
    Kvitteringskode: <strong>${code}</strong>
  </p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
  <p style="font-size:13px;color:#64748b">
    Dette er en automatisk kvittering fra 2INF Festival.<br />
    Ta kontakt med festivalansvarlig hvis noe er feil.
  </p>
  <p style="font-size:12px;color:#94a3b8">2INF Festival – Hamar katedralskole</p>
</body>
</html>`
}

// Send a receipt email to the registrant.
// Returns { sent: true } on success, { sent: false, reason } if skipped/failed.
async function sendReceiptEmail(registration) {
  if (!isSmtpConfigured()) {
    // eslint-disable-next-line no-console
    console.log('[mailer] SMTP ikke konfigurert – e-postkvittering sendes ikke.')
    return { sent: false, reason: 'smtp_not_configured' }
  }

  try {
    const transporter = createTransport()
    const from = process.env.MAIL_FROM || `2INF Festival <${process.env.SMTP_USER}>`
    await transporter.sendMail({
      from,
      to: registration.epost,
      subject: 'Kvittering for påmelding – 2INF Festival',
      text: buildEmailText(registration),
      html: buildEmailHtml(registration),
    })
    return { sent: true }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[mailer] Kunne ikke sende e-post:', err.message)
    return { sent: false, reason: err.message }
  }
}

module.exports = { sendReceiptEmail, isSmtpConfigured }
