import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';

import { cognitoClient } from '@/libs/cognitoClient';
import { response } from '@/utils/response';

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;

  const command = new AdminGetUserCommand({
    UserPoolId: process.env.COGNITO_POOL_ID,
    Username: userId,
  });

  const { UserAttributes } = await cognitoClient.send(command);

  const profile = UserAttributes?.reduce((profileObj, { Name, Value }) => {
    const keyMap = {
      given_name: 'firstName',
      family_name: 'lastName',
    };

    return {
      ...profileObj,
      [keyMap[Name as keyof typeof keyMap] ?? Name]: Value,
    };
  }, {} as any);

  return response(200, {
    profile
  });
}
