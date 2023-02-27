import { APIGatewayEvent } from "aws-lambda";
import { ProductService } from "./services/types";

export const getProductById = (productService: ProductService) =>  async (event: APIGatewayEvent, _context) => {
    try {
      if (!event.pathParameters) {
        throw new Error('No product id was provided');
      };
        const { productId = '' } = event.pathParameters;

        console.log(productId);

        const product = await productService.getProductById(productId);
        if (!product) {
          return {
            statusCode: 404,
            message: "Product not found"
          };
        }
            
        return {
          statusCode: 200,
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