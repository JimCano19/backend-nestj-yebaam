import { Injectable } from '@nestjs/common';
import { CreateTestGraphqlInput } from './dto/create-test-graphql.input';
import { UpdateTestGraphqlInput } from './dto/update-test-graphql.input';

@Injectable()
export class TestGraphqlService {
  create(createTestGraphqlInput: CreateTestGraphqlInput) {
    return 'This action adds a new testGraphql';
  }

  findAll() {
    return `This action returns all testGraphql`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testGraphql`;
  }

  update(id: number, updateTestGraphqlInput: UpdateTestGraphqlInput) {
    return `This action updates a #${id} testGraphql`;
  }

  remove(id: number) {
    return `This action removes a #${id} testGraphql`;
  }
}
