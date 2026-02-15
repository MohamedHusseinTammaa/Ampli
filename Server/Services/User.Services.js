import User from "../Models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import * as EmailService from "./Email.service.js";

const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute rate limit
const PASSWORD_RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const resendLastSentByEmail = new Map();
const forgotPasswordLastSentByEmail = new Map();

function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

const signup = async (user) => {
  const plainToken = generateVerificationToken();
  const hashedToken = await bcrypt.hash(plainToken, 10);
  user.emailVerificationTokenHash = hashedToken;
  user.emailVerificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);
  await user.save();
  const newuser = await User.find({ _id: user.id }, { password: 0, __v: 0 }).then((r) => r[0]);
  return { user: newuser, verificationToken: plainToken };
};

const login = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const confirmEmail = async (email, plainToken) => {
  const user = await User.findOne({ email }).select("+emailVerificationTokenHash +emailVerificationTokenExpires");
  if (!user || !user.emailVerificationTokenHash) return { success: false, reason: "invalid" };
  if (user.emailVerified) return { success: true, alreadyVerified: true };
  if (new Date() > user.emailVerificationTokenExpires) return { success: false, reason: "expired" };
  const match = await bcrypt.compare(plainToken, user.emailVerificationTokenHash);
  if (!match) return { success: false, reason: "invalid" };
  user.emailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();
  return { success: true };
};

const resendVerificationEmail = async (email) => {
  const now = Date.now();
  const last = resendLastSentByEmail.get(email);
  if (last != null && now - last < RESEND_COOLDOWN_MS) {
    return { sent: false, retryAfterSeconds: Math.ceil((RESEND_COOLDOWN_MS - (now - last)) / 1000) };
  }
  const user = await User.findOne({ email:email }).select("+emailVerificationTokenHash +emailVerificationTokenExpires");
  if (!user) return { sent: false, notFound: true };
  if (user.emailVerified) return { sent: false, alreadyVerified: true };
  const plainToken = generateVerificationToken();
  const hashedToken = await bcrypt.hash(plainToken, 10);
  user.emailVerificationTokenHash = hashedToken;
  user.emailVerificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);
  await user.save();
  await EmailService.sendVerificationEmail(user.email, plainToken);
  resendLastSentByEmail.set(email, now);
  return { sent: true };
};

const forgotPassword = async (email) => {
  const now = Date.now();
  const last = forgotPasswordLastSentByEmail.get(email);
  if (last != null && now - last < RESEND_COOLDOWN_MS) {
    return { sent: false, retryAfterSeconds: Math.ceil((RESEND_COOLDOWN_MS - (now - last)) / 1000) };
  }
  const user = await User.findOne({ email }).select("+passwordResetTokenHash +passwordResetTokenExpires");
  if (!user) return { sent: false, notFound: true };
  const plainToken = generateVerificationToken();
  const hashedToken = await bcrypt.hash(plainToken, 10);
  user.passwordResetTokenHash = hashedToken;
  user.passwordResetTokenExpires = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MS);
  await user.save();
  await EmailService.sendPasswordResetEmail(user.email, plainToken);
  forgotPasswordLastSentByEmail.set(email, now);
  return { sent: true };
};

const resetPassword = async (email, plainToken, newPassword) => {  
  const user = await User.findOne({ email }).select("+password +passwordResetTokenHash +passwordResetTokenExpires");
  if (!user || !user.passwordResetTokenHash) return { success: false, reason: "invalid" };
  if (new Date() > user.passwordResetTokenExpires) return { success: false, reason: "expired" };
  const match = await bcrypt.compare(plainToken, user.passwordResetTokenHash);
  if (!match) return { success: false, reason: "invalid" };
  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  return { success: true };
};

const getAllUsers = async (limit, skip) => {
  const projection = { password: 0, __v: 0, deleted: 0 };
  const users = await User.find({ deleted: false }, projection).limit(limit).skip(skip).lean();
  return users;
};

export {
  signup,
  login,
  confirmEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  getAllUsers,
};
export { sendVerificationEmail } from "./Email.service.js";