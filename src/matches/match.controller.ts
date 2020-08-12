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
    @Flags(Flag.CREATE_MATCH, Flag.DEV)
    @Put(["/:id", "/"])
    @UseGuards(AuthGuard)
    async addMatch(
        @Body() body: CreateMatchDTO,
        @Param("id") paramID?: string,
    ): Promise<TResponse> {
        return await this.matchService.createMatch(
            paramID ? Object.assign({}, body, { id: paramID }) : body,
        );
    }

    @Flags(Flag.CREATE_MATCH, Flag.DEV)
    @Delete("/:id")
    @UseGuards(AuthGuard)
    async deleteMatch(@Param() params: DeleteMatchDTO): Promise<TResponse> {
        return await this.matchService.deleteMatch(params.id);
    }
}
