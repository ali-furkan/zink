import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { StatusService } from "./status.service";
import { TResponse } from "src/@types/Response/Response";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { GetMatchDto } from "./dto/get-match.dto";
import { Flags } from "src/libs/flag.decorator";
import { Flag } from "src/libs/snowflake";
import { AuthGuard } from "src/auth/auth.guard";
import * as cache from "memory-cache";

@Controller("/status")
export class StatusController {
    constructor(private statusService: StatusService) {}

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Get("/system")
    getSystemInfo(): TResponse {
        return this.statusService.getInfo();
    }

    @Get(["/ping", "/"])
    pingPong(): TResponse {
        const time = process.hrtime(cache.get("req.time"));
        return { pong: time[0] * 10 ** 9 + time[1] };
    }

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Get("/users")
    async getUsers(@Query() query: GetUserDto): Promise<TResponse> {
        return await this.statusService.getUsers(query);
    }

    @Flags(Flag.DEV)
    @Get("/matches")
    @UseGuards(AuthGuard)
    async getMatches(@Query() query: GetMatchDto): Promise<TResponse> {
        return await this.statusService.getMatches(query);
    }
}
