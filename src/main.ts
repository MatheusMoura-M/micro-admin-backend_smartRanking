import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('Main');
const configService = new ConfigService();

async function bootstrap() {
  const RABBITMQ_USER = configService.get<string>('RABBITMQ_USER');
  const RABBITMQ_PASS = configService.get<string>('RABBITMQ_PASS');
  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_URL}`],
        noAck: false,
        queue: 'admin-backend',
      },
    },
  );

  await app.listen().then(() => logger.log('Micro-admin is listening'));
}
bootstrap();
