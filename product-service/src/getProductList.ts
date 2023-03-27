import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
} from 'aws-lambda';
import AWS from 'aws-sdk';
import { DynamoDbProductService } from './services/dynamoDbPproductService';
import { ProductService } from './services/types';

export const getProductsList = async (event: APIGatewayProxyEventV2, _context): Promise<APIGatewayProxyResultV2> => {
  const productService: ProductService = new DynamoDbProductService();
  try {
    const productList = await productService.getProductsList();
    if (productList.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: 'No products found',
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(productList),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' }),
    };
  };
};
