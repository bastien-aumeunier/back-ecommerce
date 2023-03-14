import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './service/stripe.service';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [StripeService],
    exports: [StripeService]
})
export class StripeModule {}
