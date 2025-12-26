import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get(':id')
  getConversation(@Param('id') id: string, @Req() req) {
    return this.chat.getConversation(req.user.userId, id);
  }

  @Get('contacts')
  async contacts(@Req() req) {
    return this.chat.getContacts(req.user.userId);
  }
}
