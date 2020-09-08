import * as fs from "fs";

const isProd = process.env.NODE_ENV === "production";
if (isProd) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require("dotenv").parse(fs.readFileSync("./prod.env"));
    for (const k in env) {
        process.env[k] = env[k];
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
} else require("dotenv").config();

export default (): Zink.TConfig => ({
    port: parseInt(process.env.PORT) || parseInt(process.argv[2]) || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    mongodbURI: process.env.MONGODB_URI || "",
    secret: process.env.SECRET_KEY || "test",
    rootPath: process.env.ROOT_PATH,
    flyioToken: process.env.FLYIO_TOKEN,
    isProd,
    sgKey: process.env.SG_KEY,
    mail: "noreply@zink-cloud.co",
    UUID_NAMESPACE: process.env.UUID_NAMESPACE,
    Firebase: {
        apiKey: process.env.FB_API_KEY,
        authDomain: process.env.FB_AUTH_DOMAIN,
        databaseURL: process.env.FB_DB_URL,
        projectId: process.env.FB_PROJECT_ID,
        storageBucket: process.env.FB_STORAGE_BUCKET,
        messagingSenderId: process.env.FB_MSG_SENDER_ID,
        appId: process.env.FB_APP_ID,
        measurementId: process.env.FB_MSRMT_ID,
    },
});
