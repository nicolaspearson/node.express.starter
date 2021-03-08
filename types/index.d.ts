type Nullable<T> = T | null;
type Opaque<K, T> = T & { type: K };

type Email = Opaque<'Email', string>;

declare namespace Api {
  interface ConfigOptions {
    envFilePath: string[];
  }

  interface TokenContents {
    id?: number;
  }

  interface TokenPayload {
    expiresIn?: number | string;
    tokenString: string;
  }
}
