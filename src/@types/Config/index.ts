export type TConfig = {
  NODE_ENV: string;
  port: number;
  mongodbURI: string;
  secret: string;
  rootPath: string;
  isProd: boolean;
};
