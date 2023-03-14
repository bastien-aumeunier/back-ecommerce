import { ProductQuantity, ReturnStripe } from './../model/stripe.model';
import Stripe from "stripe"
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class StripeService {
    @Inject(ConfigService)
    public config: ConfigService;


    async createPayment(price: string, userId: string, addressID: string, products: ProductQuantity[], orderID: string): Promise<ReturnStripe>{
        
        const stripe = new Stripe(this.config.get('STRIPE_SECRET_TEST'), {apiVersion: "2022-11-15"}) //Ne pas oublier de passer avec la vrai clé

        let desc = ""
        products.forEach(element => {
            desc+= `${element.productQuantity}x ${element.productName.toLocaleLowerCase()} + `
        });
        let price2 = parseFloat(price)*100
        const paymentIntent = await stripe.paymentIntents.create({
            amount: ~~price2,
            currency: 'eur',
            automatic_payment_methods: {enabled: true}, //paiement par carte config sur le dashboard
            description: desc, //faire la desc avec les produits
            statement_descriptor: `Achat ShopTaBoard`,
            metadata: {
                userId: userId, 
                addressID: addressID,
                orderID: orderID
            }
        })
        return new ReturnStripe(paymentIntent.client_secret, this.config.get('STRIPE_PUBLIC_TEST')) //Ne pas oublier de passer avec la vrai clé
    }

    async listenWebhook(body: any, sig:string){
        const stripe = new Stripe(this.config.get('STRIPE_SECRET_TEST'), {apiVersion: "2022-11-15"}) //Ne pas oublier de passer avec la vrai clé
        const endpointSecret= this.config.get('STRIPE_WEBHOOK_TEST')
        let event: any;
        try {
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        } catch (error) {
            throw new BadRequestException(`Stripe WebHook error : ${error}`)
        }
        return event
    }
}
