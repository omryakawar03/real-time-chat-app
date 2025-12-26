import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoConnection } from './config/mongo.config';
import {ConfigModule} from "@nestjs/config";
@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), MongoConnection],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

