import { Module } from '@nestjs/common';
import { NotificationsGateway } from '../../presentation/gateways/notifications.gateway';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationModule {}
