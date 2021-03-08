import * as bcrypt from 'bcrypt';

export async function encryptPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export function validatePassword(dbPassword: string, password: string): Promise<boolean> {
  return bcrypt.compare(dbPassword, password);
}
