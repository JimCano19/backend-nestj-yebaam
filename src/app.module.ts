import { Module } from '@nestjs/common';
import { AppController } from './presentation/controllers/app.controller';
import { AppService } from './app.service';
import { UserModule } from './infrastructure/modules/user.module';
import { NotificationModule } from './infrastructure/modules/notification.module';

@Module({
  imports: [UserModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
