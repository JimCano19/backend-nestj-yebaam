import { Module } from '@nestjs/common';
import { TestGraphqlService } from './test-graphql.service';
import { TestGraphqlResolver } from './test-graphql.resolver';

@Module({
  providers: [TestGraphqlResolver, TestGraphqlService],
})
export class TestGraphqlModule {}
