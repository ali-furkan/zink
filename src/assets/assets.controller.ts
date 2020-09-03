import {
    Controller,
    Get,
    Param,
    Post,
    Delete,
    Res,
    UseInterceptors,
    UploadedFile,
    UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@webundsoehne/nest-fastify-file-upload";
import { AssetsService } from "./assets.service";
import { FastifyReply } from "fastify";
import { AuthGuard } from "src/api/auth/auth.guard";
import { Flags, Flag } from "src/api/auth/flag.decorator";

@Controller("assets")
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {}

    @Get("public/:id/:name")
    async getAssetsPub(
        @Param("id") id: string,
        @Param("name") name: string,
        @Res() res: FastifyReply,
    ): Promise<void> {
        const [data, contentType] = await this.assetsService.get(
            "public",
            id,
            name,
        );
        res.header("Content-Type", contentType);
        res.send(data);
    }

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Get("dev/:id/:name")
    async getAssetsDev(
        @Param("id") id: string,
        @Param("name") name: string,
        @Res() res: FastifyReply,
    ): Promise<void> {
        const [data, contentType] = await this.assetsService.get(
            "dev",
            id,
            name,
        );
        res.header("Content-Type", contentType);
        res.send(data);
        //return data
    }

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Post("public")
    @UseInterceptors(FileInterceptor("file"))
    async upAssets(
        @UploadedFile("file") file: Zink.AssetsUpFile,
    ): Promise<Zink.Response> {
        return await this.assetsService.upload(file, false);
    }

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Post("dev")
    @UseInterceptors(FileInterceptor("file"))
    async upAssetsDev(
        @UploadedFile("file") file: Zink.AssetsUpFile,
    ): Promise<Zink.Response> {
        return await this.assetsService.upload(file, true);
    }

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Delete("/public/:id/:name")
    async delPubAssets(
        @Param("id") id: string,
        @Param("name") name: string,
    ): Promise<Zink.Response> {
        return await this.assetsService.delete(`public/${id}/${name}`);
    }

    @Flags(Flag.DEV)
    @UseGuards(AuthGuard)
    @Delete("/dev/:id/:name")
    async delDevAssets(
        @Param("id") id: string,
        @Param("name") name: string,
    ): Promise<Zink.Response> {
        return await this.assetsService.delete(`dev/${id}/${name}`);
    }
}
