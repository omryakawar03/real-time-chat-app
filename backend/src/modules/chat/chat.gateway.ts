import { WebSocketGateway, WebSocketServer, SubscribeMessage } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { SendMessageDto } from "./dto/send-message.dto";
import { verifyWsToken } from "./utils/ws-auth";


@WebSocketGateway({cors: true})
export class ChatGateway {
    @WebSocketServer()
    server: Server;
    constructor(private chat: ChatService) {}
    handleConnection(client: Socket) {const token = client.handshake.query.token as string;
  if (!token) {
    client.disconnect();
    return;
  }

  try {
    const payload = verifyWsToken(token);
    client['userId'] = payload.sub;
    client.join(payload.sub);
  } catch (e) {
    client.disconnect();
  }
    }
    @SubscribeMessage('sendMessage')
    async sendMessage(clint: Socket, payload:SendMessageDto){
        const saved = await this.chat.saveMessage(
            clint['userId'],
            payload.receiverId,
            payload.text
        );
        this.server.to(payload.receiverId).emit('newMessage', saved);
    }
}