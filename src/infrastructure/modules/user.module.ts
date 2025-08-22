import { Module } from '@nestjs/common';
import { UserService } from '../../core/application/services/user.service';
import { DrizzleUserRepository } from '../adapters/drizzle-user.repository';

@Module({
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
