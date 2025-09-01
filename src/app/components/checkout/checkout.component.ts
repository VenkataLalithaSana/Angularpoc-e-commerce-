import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    standalone: false
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  totalPrice = 0;
  paypalRendered = false;
  savedAddresses: any[] = [];
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient
  ) {
    this.checkoutForm = this.fb.group({
      address: ['']
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      Swal.fire('Not logged in', 'Please login first.', 'warning');
      this.router.navigate(['/signin']);
      return;
    }

    this.cartItems = this.cartService.getCartItems() || []; // 👈 fallback
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    this.loadSavedAddresses();
  }

  loadSavedAddresses() {
    if (!this.userId) return;

    this.http.get<{ addresses: any[] }>(`http://localhost:3000/user/${this.userId}/addresses`)
      .subscribe(
        data => this.savedAddresses = data.addresses || [],
      );
  }

  onAddressSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const index = select.selectedIndex;

    if (index > 0) {
      const selectedAddress = this.savedAddresses[index - 1];
      this.selectSavedAddress(selectedAddress);
    }
  }

  selectSavedAddress(addr: any) {
    if (!addr) return;

    const fullAddress = `${addr.street}, ${addr.city}, ${addr.state}, ${addr.postalCode}, ${addr.country}. Phone: ${addr.phone}`;
    this.checkoutForm.patchValue({ address: fullAddress });
  }

  goBack() {
    this.router.navigate(['/cart']);
  }

  async submitOrder() {
    if (!this.userId) return;

    const shippingAddress = this.checkoutForm.value.address;
    if (!shippingAddress || this.cartItems.length === 0) {
      Swal.fire('Error', 'Please enter shipping address and ensure cart is not empty.', 'error');
      return;
    }

    if (this.paypalRendered) {
      Swal.fire('Note', 'PayPal is already open.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Pay with PayPal',
      html: `<div id="paypal-button-container" class="text-center"></div>`,
      showCancelButton: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      willClose: () => {
        this.paypalRendered = false;
        const container = document.getElementById('paypal-button-container');
        if (container) container.innerHTML = '';
      },
      didOpen: () => {
        this.loadPaypalButtons(this.userId!, shippingAddress);
      }
    });
  }

  loadPaypalButtons(userId: string, shippingAddress: string) {
    const paypal = (window as any).paypal;
    if (!paypal) {
      Swal.fire('PayPal Error', 'PayPal SDK not loaded. Please try again later.', 'error');
      return;
    }

    if (this.paypalRendered) return;
    this.paypalRendered = true;

    paypal.Buttons({
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.totalPrice.toFixed(2)
            }
          }]
        });
      },
      onApprove: async (_data: any, actions: any) => {
        const order = await actions.order.capture();
        const orderData = {
          userId,
          products: this.cartItems,
          shippingAddress,
          totalPrice: this.totalPrice,
          paymentDetails: {
            method: 'paypal',
            orderId: order.id,
            payerId: order.payer?.payer_id,
            status: order.status,
            payerEmail: order.payer?.email_address,
          }
        };

        this.cartService.placeOrder(orderData).subscribe({
          next: () => {
            Swal.fire('Order Placed', 'Your order was placed successfully!', 'success').then(() => {
              this.cartService.clearCart(userId).subscribe(() => {
                this.router.navigate(['/order-success']);
              });
            });
          },
          error: err => {
            Swal.fire('Error', 'Failed to place order. Try again.', 'error');
          }
        });
      },
      onError: (err: any) => {
        Swal.fire('Payment Failed', 'PayPal transaction could not be completed.', 'error');
        this.paypalRendered = false;
      }
    }).render('#paypal-button-container');
  }
  placeOrderWithoutPayPal() {
    if (!this.userId) return;
  
    const shippingAddress = this.checkoutForm.value.address;
    if (!shippingAddress || this.cartItems.length === 0) {
      Swal.fire('Error', 'Please enter shipping address and ensure cart is not empty.', 'error');
      return;
    }
  
    const orderData = {
      userId: this.userId,
      products: this.cartItems,
      shippingAddress,
      totalPrice: this.totalPrice,
      paymentDetails: {
        method: 'manual',
        status: 'pending',
      }
    };
  
    Swal.fire({
      title: 'Confirm Order',
      text: 'Are you sure you want to place the order without PayPal?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, place order',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.placeOrder(orderData).subscribe({
          next: () => {
            Swal.fire('Order Placed', 'Your order was placed successfully!', 'success').then(() => {
              this.cartService.clearCart(this.userId!).subscribe(() => {
                this.router.navigate(['/order-success']);
              });
            });
          },
          error: err => {
            Swal.fire('Error', 'Failed to place order. Try again.', 'error');
          }
        });
      }
    });
  }
  
}
