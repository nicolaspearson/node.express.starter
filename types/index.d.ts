declare namespace Api {
  interface ConfigOptions {
    envFilePath: string[];
  }

  interface TokenContents {
    id?: number;
  }

  interface TokenData {
    tokenString: string;
    expiresIn?: number | string;
  }
}
