import {Prop , Schema , SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument  } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
    @Prop()
    senderId: string;
    @Prop()
    receiverId: string;
    @Prop()
    text: string;
    @Prop()
    fileUrl?: string;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
