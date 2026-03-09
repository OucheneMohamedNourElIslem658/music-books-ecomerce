// ─────────────────────────────────────────────────────────────────────────────
// src/utilities/emailTemplates.ts
//
// Usage in your Payload config (payload.config.ts):
//
//   email: {
//     fromName: 'Melody & Myth',
//     fromAddress: 'noreply@melodyandmyth.com',
//     transportOptions: { ... },
//   },
//
// Usage per-collection (e.g. Users collection):
//
//   auth: {
//     forgotPassword: {
//       generateEmailHTML: (args) => emailTemplates.forgotPassword(args?.token ?? ''),
//       generateEmailSubject: () => emailTemplates.subjects.forgotPassword,
//     },
//     verify: {
//       generateEmailHTML: (args) => emailTemplates.verify(args?.token ?? ''),
//       generateEmailSubject: () => emailTemplates.subjects.verify,
//     },
//   },
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? ''

const BLUE = '#2b6cee'
const GOLD = '#c9a84c'
const DARK_BG = '#101622'
const CARD_BG = '#161e2e'
const BORDER = '#1e2d47'
const TEXT = '#e2e8f0'
const MUTED = '#94a3b8'

// ─── Shared shell ─────────────────────────────────────────────────────────────
function shell(content: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Melody & Myth</title>
</head>
<body style="margin:0;padding:0;background:${DARK_BG};font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${DARK_BG};padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:10px;">
                    <!-- Music note icon approximation via text -->
                    <span style="font-size:28px;line-height:1;">♪</span>
                  </td>
                  <td>
                    <span style="font-size:13px;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;color:${TEXT};">
                      MELODY <span style="color:${GOLD};">&amp;</span> MYTH
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:${CARD_BG};border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="margin:0;font-size:11px;color:${MUTED};line-height:1.6;">
                You received this message because you have an account at Melody &amp; Myth.<br/>
                If you didn't request this, you can safely ignore it.
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:${BORDER};">
                © ${new Date().getFullYear()} Melody &amp; Myth — All rights preserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Accent bar + icon header inside card ─────────────────────────────────────
function cardHeader(icon: string, label: string) {
    return `
    <!-- Blue accent top bar -->
    <div style="height:4px;background:linear-gradient(to right,${BLUE},${GOLD});"></div>
    <!-- Icon + label -->
    <div style="padding:40px 40px 0;text-align:center;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:${BLUE}22;border:1px solid ${BLUE}44;border-radius:50%;margin-bottom:20px;">
        <span style="font-size:28px;line-height:1;">${icon}</span>
      </div>
      <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;color:${GOLD};">
        ${label}
      </p>
    </div>
  `
}

// ─── CTA button ───────────────────────────────────────────────────────────────
function ctaButton(href: string, text: string) {
    return `
    <div style="text-align:center;margin:32px 0;">
      <a href="${href}"
         style="display:inline-block;background:${BLUE};color:#ffffff;font-size:13px;font-weight:800;
                letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;
                padding:16px 40px;border-radius:9999px;
                box-shadow:0 4px 20px ${BLUE}44;">
        ${text}
      </a>
    </div>
  `
}

// ─── Fallback link ─────────────────────────────────────────────────────────────
function fallbackLink(href: string) {
    return `
    <p style="font-size:11px;color:${MUTED};text-align:center;margin:0 40px 40px;line-height:1.6;">
      If the button doesn't work, copy and paste this link:<br/>
      <a href="${href}" style="color:${BLUE};word-break:break-all;">${href}</a>
    </p>
  `
}

// ─────────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────────

export const emailTemplates = {

    subjects: {
        forgotPassword: 'Reset your Melody & Myth password',
        verify: 'Verify your Melody & Myth account',
        orderConfirmation: 'Your order is confirmed ✦ Melody & Myth',
        welcome: 'Welcome to the Archive ✦ Melody & Myth',
    },

    // ── Forgot password ──────────────────────────────────────────────────────
    forgotPassword: (token: string) => {
        const url = `${BASE_URL}/reset-password?token=${token}`
        return shell(`
      ${cardHeader('🔑', 'Password Reset')}
      <div style="padding:24px 40px 0;text-align:center;">
        <h1 style="margin:0 0 12px;font-size:26px;font-weight:900;color:${TEXT};line-height:1.2;">
          Reset your password
        </h1>
        <p style="margin:0;font-size:15px;color:${MUTED};line-height:1.7;">
          Someone requested a password reset for your account.
          Click below to choose a new password. This link expires in <strong style="color:${TEXT};">1 hour</strong>.
        </p>
      </div>
      ${ctaButton(url, 'Set New Password')}
      ${fallbackLink(url)}
    `)
    },

    // ── Email verification ───────────────────────────────────────────────────
    verify: (token: string) => {
        const url = `${BASE_URL}/verify?token=${token}`
        return shell(`
      ${cardHeader('✉️', 'Verify Your Account')}
      <div style="padding:24px 40px 0;text-align:center;">
        <h1 style="margin:0 0 12px;font-size:26px;font-weight:900;color:${TEXT};line-height:1.2;">
          Confirm your email
        </h1>
        <p style="margin:0;font-size:15px;color:${MUTED};line-height:1.7;">
          Welcome to the archive. One last step — verify your email address to unlock your full access to Melody &amp; Myth.
        </p>
      </div>
      ${ctaButton(url, 'Verify Email')}
      ${fallbackLink(url)}
    `)
    },

    // ── Welcome ──────────────────────────────────────────────────────────────
    welcome: (name?: string) => shell(`
    ${cardHeader('✦', 'Welcome to the Archive')}
    <div style="padding:24px 40px 0;text-align:center;">
      <h1 style="margin:0 0 12px;font-size:26px;font-weight:900;color:${TEXT};line-height:1.2;">
        ${name ? `Welcome, ${name}` : 'Welcome, Adventurer'}
      </h1>
      <p style="margin:0;font-size:15px;color:${MUTED};line-height:1.7;">
        Your journey through the musical realms of Melody &amp; Myth begins now.
        Explore the archive, collect enchanted tomes, and let the music guide you.
      </p>
    </div>
    ${ctaButton(`${BASE_URL}/shop`, 'Explore the Archive')}
    <div style="height:40px;"></div>
  `),

    // ── Order confirmation ───────────────────────────────────────────────────
    orderConfirmation: (opts: {
        name?: string
        orderNumber: string | number
        items: { title: string; quantity: number; price: number }[]
        total: number
    }) => {
        const { name, orderNumber, items, total } = opts
        const rows = items.map(item => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${TEXT};">
          ${item.title}
          <span style="color:${MUTED};font-size:12px;"> ×${item.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${TEXT};text-align:right;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('')

        return shell(`
      ${cardHeader('🎶', 'Order Confirmed')}
      <div style="padding:24px 40px 0;text-align:center;">
        <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:${TEXT};line-height:1.2;">
          Your tomes are on their way${name ? `, ${name}` : ''}
        </h1>
        <p style="margin:0;font-size:13px;color:${MUTED};">
          Order <strong style="color:${GOLD};">#${orderNumber}</strong>
        </p>
      </div>

      <!-- Items table -->
      <div style="margin:32px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${rows}
          <tr>
            <td style="padding:16px 0 0;font-size:15px;font-weight:900;color:${TEXT};">Total</td>
            <td style="padding:16px 0 0;font-size:15px;font-weight:900;color:${GOLD};text-align:right;">
              $${total.toFixed(2)}
            </td>
          </tr>
        </table>
      </div>

      ${ctaButton(`${BASE_URL}/account/orders`, 'View Your Order')}
      <div style="height:8px;"></div>
    `)
    },
}