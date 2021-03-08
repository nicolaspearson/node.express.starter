export function createCookie(tokenData: Api.TokenData): string {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${String(tokenData.expiresIn!)}`;
}
