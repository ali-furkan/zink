export default (): Zink.TConfig => ({
    port: parseInt(process.env.PORT) || parseInt(process.argv[2]) || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    mongodbURI: process.env.MONGODB_URI || "",
    secret: process.env.SECRET_KEY || "test",
    rootPath: process.env.ROOT_PATH || "/v1",
    flyioToken: process.env.FLYIO_TOKEN,
    isProd: process.env.NODE_ENV === "production",
    sgKey: process.env.SG_KEY,
    mail: "noreply@zink-cloud.com",
    UUID_NAMESPACE: process.env.UUID_NAMESPACE,
});
