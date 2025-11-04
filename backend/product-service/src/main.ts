import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Buat Microservice, bukan aplikasi HTTP
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3002,
      },
    },
  );
  
  // Kita masih bisa menggunakan Global Pipes
  app.useGlobalPipes(new ValidationPipe());
  
  // Jalankan microservice
  await app.listen();
  console.log('Product microservice is listening on port 3002');
}

// Logika retry Anda sudah bagus dan bisa tetap digunakan
async function startApplication() {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 detik

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await bootstrap();
      break;
    } catch (error) {
      console.error(`Failed to start product service (attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt === maxRetries) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
      
      console.log(`Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

startApplication();