import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDbProductService } from '../src/services/dynamoDbPproductService';

describe('getProductById', () => {
  test('should return product by id', async () => {
    const mockEvent = {
      body: '',
      headers: {},
      httpMethod: 'get',
      pathParameters: { id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2" }
    } as unknown as APIGatewayProxyEvent;
    const productSevice = new DynamoDbProductService('', '');
    const response = await productSevice.getProductById(mockEvent.pathParameters.id);
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toEqual({
      count: 7, 
      description: "Short Product Description2",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
      price: 23,
      title: "Bun"
    });
  });

  test('should return code 404 ifproduct not found', async () => {
    const mockEvent = {
      body: '',
      headers: {},
      httpMethod: 'get',
      pathParameters: { productId: '1' },
    } as unknown as APIGatewayProxyEventV2;
    const productSevice = new DynamoDbProductService('', '');
    const response = await productSevice.getProductById(mockEvent.pathParameters.id);
    expect(response).toHaveProperty('statusCode', 404);
  });
});
