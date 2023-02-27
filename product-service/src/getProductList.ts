import { APIGatewayProxyHandler } from "aws-lambda";

export const getAllProducts: APIGatewayProxyHandler = async (event, _context) => {
  try {
    if (!event.body) {
      return {
        statusCode: 500, 
        body:  JSON.stringify('Something went wrong !!!')
      }
    };
    const products = await JSON.parse(event.body);

    return {
      statusCode: 200,
      body: JSON.stringify( products )
    }
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
    }
  }
}