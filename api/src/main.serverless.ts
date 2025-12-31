import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import serverless from '@vendia/serverless-express';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverless({ app: expressApp });
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  // @vendia/serverless-express devuelve Promise<{statusCode, headers, body}>
  const response = await cachedServer(event, context);
  
  // Netlify espera exactamente este formato
  return {
    statusCode: response.statusCode || 200,
    headers: response.headers,
    body: response.body,
  };
};