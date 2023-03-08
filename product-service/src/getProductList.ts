import { APIGatewayEvent, APIGatewayProxyEventV2, APIGatewayProxyHandler, APIGatewayProxyHandlerV2, APIGatewayProxyResult, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDbProductService } from "services/dynamoDbPproductService";
import { Product, ProductService } from "services/types";

export const getProductsList = (productService: ProductService) => async (event: APIGatewayProxyEventV2, _context): Promise<APIGatewayProxyResultV2> => {
  // const productsData: Product[] = require('./productData/productData.json');
  try {
    // const dbService = new DynamoDbProductService('products-table');
    const products = await productService.getProductsList();
    console.log('Products list', products);

    if (products.length === 0) {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        statusCode: 404,
        body: 'No products found',
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' }),
    };
  };
};
