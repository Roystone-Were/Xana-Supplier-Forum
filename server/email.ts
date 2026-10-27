// Notification email for each new registration. Table-based layout with inline
// styles so it renders in Outlook, Gmail and phone mail apps; a single 560px
// column that shrinks to the screen width on mobile.
import { EVENT } from '../src/event.js'

const SITE_URL = process.env.SITE_URL || 'https://xana-supplier-forum.vercel.app'
const BRAND = '#005c3a'
const ACCENT = '#f58a07'

export type RegistrationEmail = {
  fullName: string
  phone: string
  company: string
  jobTitle: string
  receivedAt: string
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

const received = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    timeZone: 'Africa/Nairobi',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

function row(label: string, value: string, last = false) {
  return `<tr><td class="row" style="padding:14px 0;${last ? '' : 'border-bottom:1px solid #eef0ee;'}">
    <div class="lbl" style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#7a8781;">${label}</div>
    <div class="val" style="font-size:16px;font-weight:600;color:#14231c;margin-top:4px;line-height:1.4;">${value}</div>
  </td></tr>`
}

export function registrationEmail(r: RegistrationEmail) {
  const subject = `New registration: ${r.fullName} (${r.company})`

  const text = [
    `New registration for the ${EVENT.name}`,
    '',
    `Name: ${r.fullName}`,
    `Phone: ${r.phone}`,
    `Company: ${r.company}`,
    `Job title: ${r.jobTitle}`,
    `Received: ${received(r.receivedAt)}`,
    '',
    `${EVENT.dateLong}, ${EVENT.hours}`,
    `${EVENT.venue}, ${EVENT.venueDetail}`,
  ].join('\n')

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${esc(subject)}</title>
<style>
  @media (max-width:600px){ .pad{padding:24px 20px !important} .outer{padding:12px 8px !important} .btn a{display:block !important} }
  @media (prefers-color-scheme:dark){
    .bg{background:#121413 !important} .card{background:#1b1e1c !important;border-color:#2a2e2b !important}
    .h1,.val{color:#ffffff !important} .sub,.lbl,.foot{color:#a3ada7 !important} .row{border-color:#2a2e2b !important}
    .logo{background:#ffffff !important} .link{color:#7fd1a8 !important}
    .footbar{background:#161917 !important;border-color:#2a2e2b !important}
  }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:#faf8f6;font-family:'Plus Jakarta Sans',Segoe UI,Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;">${esc(r.fullName)} from ${esc(r.company)} registered for the ${EVENT.name}.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="bg" style="background:#faf8f6;">
<tr><td align="center" class="outer" style="padding:32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="card" style="max-width:560px;background:#ffffff;border:1px solid #e8ebe9;border-radius:16px;overflow:hidden;">
    <tr><td style="height:6px;background:${BRAND};font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td class="pad" style="padding:32px 32px 8px;">
      <div class="logo" style="display:inline-block;border-radius:10px;padding:4px 0;">
        <img src="${SITE_URL}/img/xana-logo.png" width="90" alt="Xana Life" style="display:block;width:90px;max-width:100%;height:auto;border:0;">
      </div>
      <div style="margin-top:24px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ACCENT};">${EVENT.name}</div>
      <div class="h1" style="margin-top:6px;font-size:24px;font-weight:700;line-height:1.3;color:${BRAND};">New supplier registration</div>
      <div class="sub" style="margin-top:8px;font-size:15px;line-height:1.6;color:#5b6a61;">${esc(r.fullName)} has registered to attend.</div>
    </td></tr>
    <tr><td class="pad" style="padding:8px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row('Name', esc(r.fullName))}
        ${row('Phone', `<a href="${telHref(r.phone)}" class="link" style="color:${BRAND};text-decoration:none;">${esc(r.phone)}</a>`)}
        ${row('Company', esc(r.company))}
        ${row('Job title', esc(r.jobTitle))}
        ${row('Received', received(r.receivedAt), true)}
      </table>
    </td></tr>
    <tr><td class="pad" style="padding:20px 32px 32px;">
      <table role="presentation" cellpadding="0" cellspacing="0" class="btn" width="100%"><tr>
        <td align="center" style="background:${BRAND};border-radius:10px;">
          <a href="${telHref(r.phone)}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Call ${esc(r.fullName.split(' ')[0])}</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td class="pad foot footbar" style="padding:18px 32px;background:#f4f7f5;border-top:1px solid #e8ebe9;font-size:13px;line-height:1.6;color:#6b7a71;">
      <strong style="color:inherit;">${EVENT.dateLong} · ${EVENT.hours}</strong><br>
      ${EVENT.venue}, ${EVENT.venueDetail}
    </td></tr>
  </table>
  <div class="foot" style="margin-top:16px;font-size:12px;color:#9aa59f;">Automated notice from the Xana Supplier Forum registration page.</div>
</td></tr>
</table>
</body></html>`

  return { subject, text, html }
}
