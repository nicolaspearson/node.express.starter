export function createCookie(jwtTokens: Api.JwtTokens): Cookie {
  const commonFlags = 'domain=localhost; HttpOnly; secure';
  const maxAge = String(jwtTokens.accessToken.options.expiresIn);
  return `Authorization=${jwtTokens.accessToken.jwtString}; Max-Age=${maxAge}; ${commonFlags}` as Cookie;
}
