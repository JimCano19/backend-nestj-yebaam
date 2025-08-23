import { CreateTestGraphqlInput } from './create-test-graphql.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTestGraphqlInput extends PartialType(CreateTestGraphqlInput) {
  @Field(() => Int)
  id: number;
}
