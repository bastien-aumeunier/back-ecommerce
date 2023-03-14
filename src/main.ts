import * as bodyParser from 'body-parser'
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('ShopTaBoard')
    .addBearerAuth()
    .setDescription('The ShopTaBoard API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  app.use('/orders/finish-checkout', bodyParser.raw({type: 'application/json'}))
  await app.listen(8080);
}
bootstrap();
