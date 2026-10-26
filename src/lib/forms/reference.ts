import { randomInt } from "node:crypto";

// No 0/O/1/I so a code read out loud or typed from a screenshot is never ambiguous.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** e.g. "YF-7K3QHD" (matches /^YF-[A-Z0-9]{6}$/). */
export function generateReference(): string {
  let code = "";
  for (let i = 0; i < 6; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return `YF-${code}`;
}
