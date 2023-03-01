import { APIGatewayEvent } from "aws-lambda";
import { Product } from "./services/types";

export const getProductById = /*(productService: ProductService) =>  */async (event: APIGatewayEvent, _context) => {
    try {
      if (!event.pathParameters) {
        throw new Error('No product id was provided');
      };
        const productsData: Product[] = require('./productData/productData.json');
        const { id } = event.pathParameters;

        const product = productsData.find((product) => product.id === id);
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