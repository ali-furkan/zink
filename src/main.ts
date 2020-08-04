import { NestFactory } from "@nestjs/core";
import * as helmet from "helmet";
import * as morgan from "morgan";
import { AppModule } from "src/app.module";
import Config from "src/config";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix(Config().rootPath);
  app.use(morgan(Config().isProd ? "common" : "dev"))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(Config().port, "0.0.0.0");
}
bootstrap();
