declare namespace CustomSequelize {
  interface DbConfig {
    database: string;
    username: string;
    password: string;
    params: {
      dialect: 'postgres';
      host: string;
      port: number;
      schema: string;
    };
  }
}
