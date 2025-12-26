import {MongooseModule} from '@nestjs/mongoose';

export const MongoConnection = MongooseModule.forRoot(process.env.MONGO_URI! as string);