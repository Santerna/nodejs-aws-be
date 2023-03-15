// import { S3 } from 'aws-sdk';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { createSignedUrl } from './createSignedUrl';

export const importProductsFile = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2>=> {
  if (!event.queryStringParameters?.name) {
    return {
      statusCode: 500,
      body: 'No file name was provided',
    };
  }

  const file = event.queryStringParameters.name;

  try {
    const url = await createSignedUrl(file);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(url),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Credentials': true, 
      },
      body: JSON.stringify( { message: error.message || 'Signed url creation failed' }),
    };
  };
};
