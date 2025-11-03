import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with proper configuration
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // API Gateway itself
      'http://localhost:5174', // Alternative Vite port
      'http://127.0.0.1:5173', // Localhost IP
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Headers',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
  console.log('API Gateway running on http://localhost:3000');
  console.log('CORS enabled for:', [
    'http://localhost:5173',
    'http://localhost:3000', 
    'http://localhost:5174',
    'http://127.0.0.1:5173'
  ]);
}
bootstrap();