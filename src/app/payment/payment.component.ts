import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  stripe: any;
  elements: any;

  constructor() { }

  async ngOnInit() {
    // Cargar Stripe
    this.stripe = await loadStripe('tu_clave_publica_de_stripe_aqui');
  }

  async createPaymentIntent() {
    // Aquí haces una llamada al backend para crear el PaymentIntent
    const response = await fetch('http://localhost:3000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 1000, // El monto a cobrar en centavos (ejemplo: 1000 = 10 USD)
      }),
    });
    const { clientSecret } = await response.json();

    // Utilizar el clientSecret para confirmar el pago
    this.confirmPayment(clientSecret);
  }

  async confirmPayment(clientSecret: string) {
    const paymentMethod = await this.elements.create('card');
    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Pago completado con éxito');
      }
    }
  }
}
