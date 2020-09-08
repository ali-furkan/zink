import {
    Controller,
    Get,
    Put,
    Delete,
    Body,
    Query,
    ParseIntPipe,
    Param,
} from "@nestjs/common";
import { AddWordDto } from "./dto/add-word.dto";
import { WordService } from "./words.service";
import { WordEntity } from "./words.entity";

@Controller("words")
export class WordController {
    constructor(private wordService: WordService) {}

    @Get("/id/:id")
    async getWord(@Param("id") id: string): Promise<WordEntity> {
        return await this.wordService.getID(id);
    }

    @Get()
    async getRandomWord(
        @Query("difficulty") difficulty?: number,
    ): Promise<WordEntity> {
        return await this.wordService.getRandom(difficulty);
    }

    @Get("/all")
    async getAllWord(
        @Query("begin") begin?: number,
        @Query("length") length?: number,
    ): Promise<WordEntity[]> {
        return await this.wordService.getAll(begin, length);
    }

    @Put()
    async addWord(@Body() wordBody: AddWordDto): Promise<Zink.Response> {
        return this.wordService.add(wordBody);
    }

    @Delete("/id/:id")
    async delWord(@Param("id") id: string): Promise<WordEntity> {
        return await this.wordService.getID(id);
    }
}
