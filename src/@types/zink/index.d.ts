export {};

declare global {
    namespace Zink {
        type TConfig = {
            NODE_ENV: string;
            port: number;
            mongodbURI: string;
            secret: string;
            rootPath: string;
            isProd: boolean;
            flyioToken: string;
            sgKey: string;
            mail: string;
            UUID_NAMESPACE;
        };

        type MatchTypes = "duel" | "catch" | "fast-typing" | "math";

        interface MatchEntity {
            id: string;
            type: MatchTypes;
            status: boolean;
            winner: { id: string };
            users: Array<{
                id: number;
            }>;
        }

        interface IToken {
            id: string;
            email: string;
            flags: number;
        }

        interface Response {
            message?: string;
            [propName: string]: any;
        }

        interface RequestUser extends IToken {
            iat: number;
            exp: number;
        }
    }
}
