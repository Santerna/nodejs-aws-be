import { APIGatewayProxyEventV2 } from "aws-lambda";
import { DynamoDbProductService } from "./services/dynamoDbPproductService";
import { Product, ProductService } from "./services/types";

export const getProductById = async (event: APIGatewayProxyEventV2, _context) => {
    const productService: ProductService = new DynamoDbProductService();
    try {
      console.log('Start getting product by id');
      if (!event.pathParameters) {
        throw new Error('No product id was provided');
      };
      console.log('Product service', productService);
      const { productId } = event.pathParameters;
      console.log('Product id', event.pathParameters.productId);
      const product: Product = await productService.getProductById(productId);
      console.log('Product', product);

      if (!product) {
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
        body: JSON.stringify(product),
      };
    }
    catch (error) {
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
