import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forRoot()],
  controllers: [],
  providers: [],
  exports: [],
})
export class RecordsModule {}
