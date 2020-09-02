import { Controller, Get, Param, Post, Delete, Body, Header, UseInterceptors, UploadedFile, Query } from "@nestjs/common";
import { FileInterceptor } from "@webundsoehne/nest-fastify-file-upload";
import { AssetsService } from "./assets.service";

@Controller("assets")
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {}

    @Get("public/:id/:name")
    @Header("Content-Type", "*/*")
    async getAssetsPub(@Param("id") id:string,@Param("name") name:string):Promise<Zink.Response> {
        return await this.assetsService.get("public",id,name)
    }

    @Get("dev/:id/:name")
    @Header("Content-Type", "*/*")
    async getAssetsDev(@Param("id") id:string,@Param("name") name:string):Promise<Zink.Response> {
        return await this.assetsService.get("dev",id,name)
    }

    @Post("public")
    @UseInterceptors(FileInterceptor("file"))
    async upAssets(@UploadedFile() file: {
        fieldname: string;
        originalname: string;
        encoding: string;
        buffer: Buffer;
    }):Promise<Zink.Response> {
        return await this.assetsService.upload(file,false)
    }

    @Post("dev")
    @UseInterceptors(FileInterceptor("file"))
    async upAssetsDev(@UploadedFile() file: {
        fieldname: string;
        originalname: string;
        encoding: string;
        buffer: Buffer;
    }):Promise<Zink.Response> {
        return await this.assetsService.upload(file,true)
    }

    @Delete(":root/:id/:name")
    async delAssets(@Param("root") root:string, @Param("id") id:string,@Param("name") name:string):Promise<Zink.Response> {
        return await this.assetsService.delete(`${root}/${id}/${name}`)
    }
}