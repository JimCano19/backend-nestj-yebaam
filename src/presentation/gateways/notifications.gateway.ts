import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { NotificationServicePort } from '../../core/domain/ports/notification.port';
import { Notification } from '../../core/domain/entities/notification.entity';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // En producción, especificar dominios permitidos
    methods: ['GET', 'POST'],
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, NotificationServicePort
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationsGateway');
  private connectedClients = new Map<string, string>(); // socketId -> userId

  afterInit(server: Server) {
    this.logger.log('🔌 WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    
    // Extraer userId de query params o headers
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedClients.set(client.id, userId);
      client.join(`user:${userId}`); // Unir a room específico del usuario
      this.logger.log(`Usuario ${userId} conectado en socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedClients.get(client.id);
    this.connectedClients.delete(client.id);
    this.logger.log(`Cliente desconectado: ${client.id} (Usuario: ${userId})`);
  }

  // Implementación del Port para NotificationServicePort
  async sendToUser(userId: string, notification: Notification): Promise<void> {
    this.server.to(`user:${userId}`).emit('notification', notification);
    this.logger.log(`Notificación enviada a usuario ${userId}:`, notification);
  }

  async sendToMultipleUsers(userIds: string[], notification: Notification): Promise<void> {
    for (const userId of userIds) {
      await this.sendToUser(userId, notification);
    }
  }

  async broadcastToAll(notification: Notification): Promise<void> {
    this.server.emit('notification', notification);
    this.logger.log('Broadcast enviado:', notification);
  }

  // Método para enviar notificación a un usuario específico (método legacy)
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
    this.logger.log(`Notificación enviada a usuario ${userId}:`, notification);
  }

  // Método para broadcast a todos los usuarios conectados (método legacy)
  broadcastNotification(notification: any) {
    this.server.emit('notification', notification);
    this.logger.log('Broadcast enviado:', notification);
  }

  // Listener para cuando un cliente quiere unirse a una sala específica
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.logger.log(`Cliente ${client.id} se unió a la sala: ${data.room}`);
    return { success: true, room: data.room };
  }

  // Listener para mensajes de chat o notificaciones personalizadas
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { room: string; message: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Enviar mensaje a todos en la sala
    this.server.to(data.room).emit('message', {
      userId: data.userId,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Mensaje enviado a sala ${data.room} por ${data.userId}`);
    return { success: true };
  }

  // Obtener usuarios conectados
  getConnectedUsers(): string[] {
    return Array.from(this.connectedClients.values());
  }

  // Verificar si un usuario está conectado
  isUserConnected(userId: string): boolean {
    return Array.from(this.connectedClients.values()).includes(userId);
  }
}
