import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTestGraphqlInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
