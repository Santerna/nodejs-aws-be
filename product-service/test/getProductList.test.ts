import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DynamoDbProductService } from 'services/dynamoDbPproductService';
import { getProductsList } from '../src/getProductList';

const context = {} as Context;
const callback = jest.fn();
// const mockDbService: jest.Mocked<DynamoDbProductService> = {
  // dynamoDb: jest.fn(),
//   getProductsList: jest.fn(),
//   getProductById: jest.fn(),
// };

describe('getProductList', () => {
  test('should return product list on event', async () => {
    const mockEvent = {
      body: '',
      headers: {},
      httpMethod: 'get'
    } as unknown as APIGatewayProxyEventV2;
    const productSevice = new DynamoDbProductService('', '');
    const response = await productSevice.getProductsList();
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('body', '');
  });
});
