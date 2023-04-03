import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import { generatePolicy } from "./generatePolicy";

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  console.log('Event: ', JSON.stringify(event));

  const authToken = event.authorizationToken;

  const encodedCreds = authToken.split(' ')[1];
  const buf = Buffer.from(encodedCreds, 'base64');
  const plainCreds = buf.toString('utf-8').split(':');
  console.log('Got creds', plainCreds);
  const username = plainCreds[0];
  const pass = plainCreds[1];

  console.log(`User name: ${username}, password ${pass}`);

  const storedUserPassword = pass;

  const effect = !storedUserPassword || storedUserPassword != pass ? 'Deny' : 'Allow'
  
  const policy = generatePolicy(encodedCreds, event.methodArn, effect);
  return policy;
};
