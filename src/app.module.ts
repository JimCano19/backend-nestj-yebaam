import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { SharedModule } from '@shared/shared.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    FeaturesModule,
    SharedModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
