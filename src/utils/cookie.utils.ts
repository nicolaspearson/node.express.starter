export function createCookie(tokenData: Api.TokenData): string {
  return `Authorization=${tokenData.tokenString}; HttpOnly; Max-Age=${String(
    tokenData.expiresIn!
  )}`;
}
