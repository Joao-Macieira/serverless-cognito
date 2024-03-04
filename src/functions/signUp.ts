import { SignUpCommand, UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParser } from '@/utils/bodyParse';
import { response } from '@/utils/response';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        { Name: 'given_name', Value: body.firstName },
        { Name: 'family_name', Value: body.lastName },
      ]
    });

    const { UserSub } = await cognitoClient.send(command);

    return response(200, {
      user: {
        id: UserSub,
      }
    });
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return response(409, {
        error: 'This email is already in use'
      });
    }

    return response(500, {
      error: 'Internal Server Error'
    });
  }
}
