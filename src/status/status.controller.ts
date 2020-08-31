import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import * as cache from "memory-cache";
import { StatusService } from "./status.service";
import { AuthGuard } from "src/auth/auth.guard";
import { Flags, Flag } from "src/auth/flag.decorator";
import { GetUserDto } from "./dto/get-user.dto";
import { GetMatchDto } from "./dto/get-match.dto";

@Controller("/status")
export class StatusController {
    constructor(private statusService: StatusService) {}

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Get("/system")
    getSystemInfo(): Zink.Response {
        return this.statusService.getInfo();
    }

    @Get(["/ping", "/"])
    pingPong(): Zink.Response {
        const time = process.hrtime(cache.get("req.time"));
        return { pong: time[0] * 10 ** 9 + time[1] };
    }

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Get("/users")
    async getUsers(@Query() query: GetUserDto): Promise<Zink.Response> {
        return await this.statusService.getUsers(query);
    }

    @Flags(Flag.DEV)
    @Get("/matches")
    @UseGuards(AuthGuard)
    async getMatches(@Query() query: GetMatchDto): Promise<Zink.Response> {
        return await this.statusService.getMatches(query);
    }

    @Flags(Flag.DEV)
    @Get("/hosting")
    async getStatus(): Promise<Zink.Response> {
        return this.statusService.getHosting();
    }
}
