import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TestGraphqlService } from './test-graphql.service';
import { TestGraphql } from './entities/test-graphql.entity';
import { CreateTestGraphqlInput } from './dto/create-test-graphql.input';
import { UpdateTestGraphqlInput } from './dto/update-test-graphql.input';

@Resolver(() => TestGraphql)
export class TestGraphqlResolver {
  constructor(private readonly testGraphqlService: TestGraphqlService) {}

  @Mutation(() => TestGraphql)
  createTestGraphql(@Args('createTestGraphqlInput') createTestGraphqlInput: CreateTestGraphqlInput) {
    return this.testGraphqlService.create(createTestGraphqlInput);
  }

  @Query(() => [TestGraphql], { name: 'testGraphql' })
  findAll() {
    return this.testGraphqlService.findAll();
  }

  @Query(() => TestGraphql, { name: 'testGraphql' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.testGraphqlService.findOne(id);
  }

  @Mutation(() => TestGraphql)
  updateTestGraphql(@Args('updateTestGraphqlInput') updateTestGraphqlInput: UpdateTestGraphqlInput) {
    return this.testGraphqlService.update(updateTestGraphqlInput.id, updateTestGraphqlInput);
  }

  @Mutation(() => TestGraphql)
  removeTestGraphql(@Args('id', { type: () => Int }) id: number) {
    return this.testGraphqlService.remove(id);
  }
}
