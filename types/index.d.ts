type Nullable<T> = T | null;
type Opaque<K, T> = T & { type: K };

type Cookie = Opaque<'Cookie', string>;
type Email = Opaque<'Email', string>;
type JwtString = Opaque<'JwtString', string>;

declare namespace Api {
  interface ConfigOptions {
    envFilePath: string[];
  }

  type JwtPayload = {
    id: number;
  };

  interface Jwt extends JwtPayload {
    iat: number;
    exp: number;
    jti: UUID;
    iss: string;
  }

  interface JwtTokens {
    accessToken: { jwtString: JwtString; options: { expiresIn?: number | string } };
  }
}
