export function createCookie(tokenPayload: Api.TokenPayload): string {
  return `Authorization=${tokenPayload.tokenString}; HttpOnly; Max-Age=${String(
    tokenPayload.expiresIn!
  )}`;
}
