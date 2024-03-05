import type { CustomMessageTriggerEvent } from 'aws-lambda';

export async function handler(event: CustomMessageTriggerEvent) {
  const code = event.request.codeParameter;
  const name = event.request.userAttributes.given_name;
  const email = event.request.userAttributes.email;

  if (event.triggerSource === 'CustomMessage_SignUp') {

    event.response.emailSubject = `Bem-vindo(a) ${name}`;
    event.response.emailMessage = `<h1>Seja muito bem-vindo(a) ${name}</h1><br />Use este código para confirmar a sua conta: ${code}`;
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Recuração de conta';
    event.response.emailMessage = `<h1>Para recuperar sua conta, acesse:</h1> <strong>https://app/seuapp/com.br/reset?email=${encodeURIComponent(email)}&code=${code}</strong>`;
  }

  return event;
}
