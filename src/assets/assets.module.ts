import { Module } from "@nestjs/common";
import { AssetsService } from "./assets.service";
import { UsersModule } from "src/api";
import { AssetsController } from "./assets.controller";

@Module({
    imports: [UsersModule],
    controllers: [AssetsController],
    providers: [AssetsService],
})
export class AssetsModule {
    constructor() {
        global.XMLHttpRequest = require("xhr2");
        global.WebSocket = require("ws");
    }
}
