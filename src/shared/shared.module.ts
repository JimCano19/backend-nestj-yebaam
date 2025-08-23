import { Module } from '@nestjs/common';
import { DrizzleModule } from './database/drizzle/drizzle.module';
import { AppGraphQLModule } from './graphql/graphql.module';

@Module({
  imports: [DrizzleModule,AppGraphQLModule],
  exports: [DrizzleModule,AppGraphQLModule],
})
export class SharedModule {}
