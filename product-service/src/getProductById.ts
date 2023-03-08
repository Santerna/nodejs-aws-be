import { APIGatewayEvent } from "aws-lambda";
import { DynamoDbProductService } from "services/dynamoDbPproductService";
import { Product, ProductService } from "./services/types";

export const getProductById = (productService: ProductService) => async (event: APIGatewayEvent, _context) => {
    try {
      if (!event.pathParameters) {
        throw new Error('No product id was provided');
      };
      console.log('Product service', productService);
      const dbService = new DynamoDbProductService('products-table');
      const { productId } = event.pathParameters;
      console.log('Product id', event.pathParameters.productId);
      const product: Product = await dbService.getProductById(productId);
      console.log('Product', product);

      if (!product) {
        return {
          statusCode: 404,
          message: "Product not found"
        };
      }
            
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: product
      };
    }
    catch (error) {
      return {
        statusCode: 500,
        body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
      }
    }
}