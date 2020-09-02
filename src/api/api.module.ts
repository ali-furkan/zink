import { Module } from "@nestjs/common";
import { RouterModule } from "nest-router";
import { UsersModule, StatusModule, MatchModule, AuthModule } from "./";

@Module({
    imports: [
        RouterModule.forRoutes([
            {
                path: "/api/v1",
                module: ApiModule,
                children: [StatusModule, UsersModule, MatchModule, AuthModule],
            },
        ]),
        UsersModule,
        StatusModule,
        MatchModule,
        AuthModule,
    ],
})
export class ApiModule {}
