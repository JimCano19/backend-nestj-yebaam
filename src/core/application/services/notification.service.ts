import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepositoryPort, NotificationServicePort } from '../../domain/ports/notification.port';
import { Notification, CreateNotificationData, NotificationType } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepositoryPort,
    private readonly notificationServicePort: NotificationServicePort,
  ) {}

  async createAndSendNotification(notificationData: CreateNotificationData): Promise<Notification> {
    // Crear la notificación en la base de datos
    const notification = await this.notificationRepository.create(notificationData);
    
    // Enviar notificación en tiempo real si el usuario está conectado
    if (this.notificationServicePort.isUserConnected(notificationData.userId)) {
      await this.notificationServicePort.sendToUser(notificationData.userId, notification);
    }

    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.findByUserId(userId);
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.findUnreadByUserId(userId);
  }

  async markAsRead(notificationId: string): Promise<void> {
    const marked = await this.notificationRepository.markAsRead(notificationId);
    if (!marked) {
      throw new NotFoundException(`Notificación con ID ${notificationId} no encontrada`);
    }
  }

  async markAllAsReadForUser(userId: string): Promise<number> {
    return await this.notificationRepository.markAllAsReadForUser(userId);
  }

  async sendSystemNotification(message: string, title: string = 'Notificación del Sistema'): Promise<void> {
    const connectedUsers = this.notificationServicePort.getConnectedUsers();
    
    for (const userId of connectedUsers) {
      const notification = await this.notificationRepository.create({
        userId,
        title,
        message,
        type: NotificationType.SYSTEM,
      });

      await this.notificationServicePort.sendToUser(userId, notification);
    }
  }

  async broadcastNotification(title: string, message: string, type: NotificationType = NotificationType.INFO): Promise<void> {
    const connectedUsers = this.notificationServicePort.getConnectedUsers();
    
    // Crear notificación para cada usuario conectado
    const notifications = await Promise.all(
      connectedUsers.map(userId =>
        this.notificationRepository.create({
          userId,
          title,
          message,
          type,
        })
      )
    );

    // Enviar broadcast
    if (notifications.length > 0) {
      await this.notificationServicePort.broadcastToAll(notifications[0]);
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const deleted = await this.notificationRepository.delete(notificationId);
    if (!deleted) {
      throw new NotFoundException(`Notificación con ID ${notificationId} no encontrada`);
    }
  }

  // Métodos para obtener estadísticas de conexiones
  getConnectedUsersCount(): number {
    return this.notificationServicePort.getConnectedUsers().length;
  }

  isUserOnline(userId: string): boolean {
    return this.notificationServicePort.isUserConnected(userId);
  }
}
