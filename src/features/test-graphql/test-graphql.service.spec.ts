import { Test, TestingModule } from '@nestjs/testing';
import { TestGraphqlService } from './test-graphql.service';

describe('TestGraphqlService', () => {
  let service: TestGraphqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestGraphqlService],
    }).compile();

    service = module.get<TestGraphqlService>(TestGraphqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
