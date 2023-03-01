import { APIGatewayEvent } from "aws-lambda";
import { Product } from "services/types";

export const getProductsList = async (event: APIGatewayEvent) => {
  const productsData: Product[] = require('./productData/productData.json');
  try {
    const products = JSON.stringify(productsData); 

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify( products )
    }
  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify( { message: error.message || 'Something went wrong !!!' })
    }
  }
}