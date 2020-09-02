import { Controller, Get, Query, UseGuards, Body, Post } from "@nestjs/common";
import * as cache from "memory-cache";
import { StatusService } from "./status.service";
import { AuthGuard } from "../auth/auth.guard";
import { Flags, Flag } from "../auth/flag.decorator";
import { GetMatchDto, SendDTO, GetUserDto } from "./dto";

@Controller("status")
export class StatusController {
    constructor(private statusService: StatusService) {}

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Get("system")
    getSystemInfo(): Zink.Response {
        return this.statusService.getInfo();
    }

    @Get(["ping", "/"])
    pingPong(): Zink.Response {
        const time = process.hrtime(cache.get("req.time"));
        return { pong: time[0] * 10 ** 9 + time[1] };
    }

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Get("users")
    async getUsers(@Query() query: GetUserDto): Promise<Zink.Response> {
        return await this.statusService.getUsersOrUser(query);
    }

    @Flags(Flag.DEV)
    @Get("matches")
    @UseGuards(AuthGuard)
    async getMatches(@Query() query: GetMatchDto): Promise<Zink.Response> {
        return await this.statusService.getMatches(query);
    }

    @Flags(Flag.DEV)
    @Get("hosting")
    async getStatus(): Promise<Zink.Response> {
        return this.statusService.getHosting();
    }

    @Flags(Flag.DEV)
    @Post("send")
    async sendAny(@Body() body: SendDTO): Promise<Zink.Response> {
        return await this.statusService.sendAny(body);
    }

    @Flags(Flag.DEV)
    @Get("logs")
    async getLogs(): Promise<Zink.Response> {
        return await this.statusService.getLogs();
    }
}
