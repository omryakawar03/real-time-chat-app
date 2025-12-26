
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './entities/message.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>){}
    
    async saveMessage(senderId: string, receiverId: string, text: string) {
        return this.messageModel.create({ senderId, receiverId, text });
    }
   async getConversation(a: string, b: string) {
        return this.messageModel.find({
            $or: [
                { senderId: a, receiverId: b },
                { senderId: b, receiverId: a },
            ],
        }).sort({ createdAt: 1 });
   }
   async getContacts(userId: string) {
  return this.messageModel.aggregate([
    { $match: { $or: [ { senderId: userId }, { receiverId: userId } ] } },
    { $group: {
        _id: { $cond: [ { $eq: ["$senderId", userId] }, "$receiverId", "$senderId" ] }
    }},
    { $project: { contactId: "$_id", _id: 0 } }
  ]);
}
}
