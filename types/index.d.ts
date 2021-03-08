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
