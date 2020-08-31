import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/user.module";
import { MatchModule } from "./matches/match.module";
import Config from "./config";
import { AuthModule } from "./auth/auth.module";
import { RateLimiterModule, RateLimiterGuard } from "nestjs-rate-limit";
import { APP_GUARD } from "@nestjs/core";
import { StatusModule } from "./status/status.module";
import * as sgMail from "@sendgrid/mail";

@Module({
    imports: [
        RateLimiterModule.forRoot({
            points: 100,
            duration: 5,
            keyPrefix: "global",
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [Config],
        }),
        TypeOrmModule.forRoot({
            type: "mongodb",
            url: Config().mongodbURI,
            database: "Zink-DB",
            synchronize: true,
            logger: "debug",
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoLoadEntities: true,
        }),
        UsersModule,
        MatchModule,
        AuthModule,
        StatusModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RateLimiterGuard,
        },
    ],
})
export class AppModule {
    constructor() {
        sgMail.setApiKey(Config().sgKey);
    }
}
