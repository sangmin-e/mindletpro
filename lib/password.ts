import bcrypt from "bcryptjs";

const PASSWORD_PATTERN = /^\d{4}$/;
const SALT_ROUNDS = 10;

export function assertMemoPassword(password: string) {
  if (!PASSWORD_PATTERN.test(password)) {
    throw new Error("작성자 암호는 숫자 4자리여야 합니다.");
  }
}

export async function hashMemoPassword(password: string) {
  assertMemoPassword(password);
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyMemoPassword(password: string, hash: string) {
  assertMemoPassword(password);
  return bcrypt.compare(password, hash);
}
