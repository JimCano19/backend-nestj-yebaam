import { Notification, CreateNotificationData } from '../entities/notification.entity';

// Port - Interface para el repositorio de notificaciones
export interface NotificationRepositoryPort {
  findByUserId(userId: string): Promise<Notification[]>;
  findUnreadByUserId(userId: string): Promise<Notification[]>;
  create(notificationData: CreateNotificationData): Promise<Notification>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsReadForUser(userId: string): Promise<number>;
  delete(id: string): Promise<boolean>;
}

// Port - Interface para el servicio de notificaciones en tiempo real
export interface NotificationServicePort {
  sendToUser(userId: string, notification: Notification): Promise<void>;
  sendToMultipleUsers(userIds: string[], notification: Notification): Promise<void>;
  broadcastToAll(notification: Notification): Promise<void>;
  isUserConnected(userId: string): boolean;
  getConnectedUsers(): string[];
}
