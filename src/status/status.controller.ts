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

}
