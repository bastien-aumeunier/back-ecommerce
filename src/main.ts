import * as bodyParser from 'body-parser'
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
//import * as fs from 'fs';

async function bootstrap() {
  //if you want to use https
  /* const httpsOptions = {
    key: fs.readFileSync('/certs/private.key'),
    cert: fs.readFileSync('/certs/certificate.crt'),
  }; */

  const app = await NestFactory.create(AppModule, {
   //httpsOptions 
  });
  const config = new DocumentBuilder()
    .setTitle('ShopTaBoard')
    .addBearerAuth()
    .setDescription('The ShopTaBoard API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  app.enableCors();
  app.use('/orders/finish-checkout', bodyParser.raw({type: 'application/json'}))
  await app.listen(8080);
}
bootstrap();
