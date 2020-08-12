import { TConfig } from "../@types/Config";

export default (): TConfig => ({
    port: parseInt(process.env.PORT) || parseInt(process.argv[2]) || 3001,
    NODE_ENV: process.env.NODE_ENV || "development",
    mongodbURI: process.env.MONGODB_URI || "",
    secret: process.env.SECRET_KEY || "test",
    rootPath: process.env.ROOT_PATH || "/v1",
    isProd: process.env.NODE_ENV === "production",
});
