declare namespace Api {
  interface ConfigOptions {
    envFilePath: string[];
  }

  interface TokenContents {
    id?: number;
  }

  interface TokenData {
    token: string;
    expiresIn?: number | string;
  }
}
