import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/user.module";
import { MatchModule } from "./matches/match.module";
import Config from "./config";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
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
  ],
})
export class AppModule {}
