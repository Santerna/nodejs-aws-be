import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProductsList } from '../src/getProductList';

describe('getProductList', () => {
  test('should return product list on event', async () => {
    const mockEvent = {
      body: '',
      headers: {},
      httpMethod: 'get'
    } as APIGatewayProxyEvent;
    const response = await getProductsList(mockEvent);
    expect(response).toHaveProperty('statusCode', 200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
