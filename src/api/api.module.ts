import { Module } from "@nestjs/common";
import { RouterModule } from "nest-router";
import { UsersModule, StatusModule, MatchModule } from "./";

@Module({
    imports: [
        RouterModule.forRoutes([
            {
                path: "/api/v1",
                module: ApiModule,
                children: [StatusModule, UsersModule, MatchModule],
            },
        ]),
        UsersModule,
        StatusModule,
        MatchModule,
    ],
})
export class ApiModule {}
