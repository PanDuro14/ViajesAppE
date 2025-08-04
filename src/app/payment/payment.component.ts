import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  stripe: any;
  elements: any;
  card: any;

  constructor() { }

  async ngOnInit() {
    // Cargar Stripe
    this.stripe = await loadStripe('tu_clave_publica_de_stripe_aqui');

    if (this.stripe) {
      // Crear los elementos de Stripe
      this.elements = this.stripe.elements();
      if (this.elements) {
        // Solo crea el formulario de la tarjeta si 'this.elements' no es null
        this.card = this.elements.create('card');
        this.card.mount('#card-element');
      } else {
        console.error('Stripe Elements no se pudo inicializar.');
      }
    } else {
      console.error('No se pudo cargar Stripe.');
    }
  }

  async createPaymentIntent() {
    try {
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
      this.confirmPayment(clientSecret);
    } catch (error) {
      console.error('Error al crear PaymentIntent:', error);
    }
  }

  async confirmPayment(clientSecret: string) {
    if (this.card) {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card,
        },
      });

      if (result.error) {
        console.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log('Pago completado con éxito');
        }
      }
    } else {
      console.error('La tarjeta de Stripe no se ha inicializado.');
    }
  }
}
