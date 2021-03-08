type Nullable<T> = T | null;
type Opaque<K, T> = T & { type: K };

type Email = Opaque<'Email', string>;

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

  interface TokenPayload {
    expiresIn?: number | string;
    tokenString: string;
  }
}
