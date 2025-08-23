import { Test, TestingModule } from '@nestjs/testing';
import { TestGraphqlResolver } from './test-graphql.resolver';
import { TestGraphqlService } from './test-graphql.service';

describe('TestGraphqlResolver', () => {
  let resolver: TestGraphqlResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestGraphqlResolver, TestGraphqlService],
    }).compile();

    resolver = module.get<TestGraphqlResolver>(TestGraphqlResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
