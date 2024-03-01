import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:123123@localhost:5672/smartranking'],
        noAck: false,
        queue: 'admin-backend',
      },
    },
  );

  await app.listen().then(() => logger.log('Microservice is listening'));
}
bootstrap();
