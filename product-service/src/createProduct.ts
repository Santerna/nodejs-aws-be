import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { ProductService } from 'services/types';
import { validateProductData } from './utils/validation';

export const createProduct = (productService: ProductService) => async (event: APIGatewayProxyEventV2, _context): Promise<APIGatewayProxyResultV2> => {
  try {
    console.log('Create event', event);
    const productData = JSON.parse(Buffer.from(event.body, 'base64').toString());
    console.log('Product data', productData);
    validateProductData(productData);
    const product = await productService.createProduct(productData);
    console.log('Products list', product);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
    };
  };
};
