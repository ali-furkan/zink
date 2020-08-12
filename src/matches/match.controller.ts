import {
    Controller,
    Put,
    Get,
    Param,
    UseGuards,
    Delete,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common";
import { TResponse } from "src/@types/Response/Response";
import { AuthGuard } from "src/auth/auth.guard";
import { User } from "src/users/user.decorator";
import { ReqUser } from "src/@types/User/ReqUser";
import { Flags } from "src/libs/flag.decorator";
import { Flag } from "src/libs/snowflake";
import { MatchService } from "./match.service";
import { CreateMatchDTO } from "./dto/create-match.dto";
import { GetMatchDto } from "./dto/get-match.dto";
import { DeleteMatchDTO } from "./dto/delete-match.dto";

@Controller("/matches")
export class MatchController {
    constructor(private matchService: MatchService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("/:id")
    @UseGuards(AuthGuard)
    async getMatch(
        @Param() params: GetMatchDto,
        @User() user: ReqUser,
    ): Promise<TResponse> {
        return this.matchService.getMatch({ id: params.id, user });
    }
    
}
