import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { TestGraphqlModule } from './test-graphql/test-graphql.module';

@Module({
    imports: [ HealthModule, TestGraphqlModule],
    controllers: [],
    providers: [],
    exports: []
})
export class FeaturesModule { }
