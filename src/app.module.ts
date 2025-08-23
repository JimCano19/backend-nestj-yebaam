import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [
    FeaturesModule,
    SharedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
