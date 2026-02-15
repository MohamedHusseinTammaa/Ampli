import "dotenv/config";

const VERIFY_EMAIL_BASE_URL = process.env.VERIFY_EMAIL_BASE_URL || process.env.FRONTEND_URL || "http://localhost:3000";
const VERIFY_EMAIL_PATH = process.env.VERIFY_EMAIL_PATH || "/api/user/verify-email";
const RESET_PASSWORD_PATH = process.env.RESET_PASSWORD_PATH || "/api/user/reset-password";

/**
 * Build the verification link the user will click (frontend should post token to POST /api/User/confirm).
 * @param {string} email - User email (for link query)
 * @param {string} token - Plain verification token
 * @returns {string} Full URL
 */
export function getVerificationLink(email, token) {
  const params = new URLSearchParams({ email, token });
  return `${VERIFY_EMAIL_BASE_URL}${VERIFY_EMAIL_PATH}?${params.toString()}`;
}

/**
 * Send verification email. Uses nodemailer if SMTP is configured; otherwise logs the link (dev).
 * @param {string} to - Email address
 * @param {string} token - Plain verification token
 * @returns {Promise<void>}
 */
export async function sendVerificationEmail(to, token) {
  const link = getVerificationLink(to, token);
  const subject = "Verify your email";
  const html = `
    <p>Please verify your email by clicking the link below:</p>
    <p><a href="${link}">${link}</a></p>
    <p>This link expires in 24 hours. If you did not create an account, ignore this email.</p>
  `;

  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;

  if (userEmail && userPassword) {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.default.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: userEmail,
        pass: userPassword,
      },
    });
    await transport.sendMail({
      from: userEmail,
      to,
      subject,
      html,
    });
  } else {
    console.log("[Email.service] No USER_EMAIL/USER_PASSWORD configured. Verification link:", link);
  }
}

/**
 * Build the password reset link (frontend should post token + newPassword to POST /api/User/reset-password).
 */
export function getResetPasswordLink(email, token) {
  const params = new URLSearchParams({ email, token });
  return `${VERIFY_EMAIL_BASE_URL}${RESET_PASSWORD_PATH}?${params.toString()}`;
}

/**
 * Send password reset email.
 */
export async function sendPasswordResetEmail(to, token) {
  const link = getResetPasswordLink(to, token);
  const subject = "Reset your password";
  const html = `
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p><a href="${link}">${link}</a></p>
    <p>This link expires in 1 hour and can only be used once. If you did not request this, ignore this email.</p>
  `;

  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;

  if (userEmail && userPassword) {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.default.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: userEmail, pass: userPassword },
    });
    await transport.sendMail({ from: userEmail, to, subject, html });
  } else {
    console.log("[Email.service] No USER_EMAIL/USER_PASSWORD configured. Reset link:", link);
  }
}
