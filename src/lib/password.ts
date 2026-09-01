/**
 * Password hashing utilities using bcryptjs.
 *
 * bcrypt with cost factor 12 — balances security and performance.
 */

import bcrypt from "bcryptjs";

const COST_FACTOR = 12;

/** Hash a plaintext password */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, COST_FACTOR);
}

/** Verify a plaintext password against a hash */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
