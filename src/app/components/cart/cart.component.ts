import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
    standalone: false
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  showOrderForm: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.fetchCartFromServer().subscribe((items: any) => {
      this.cartItems = items.products; 
    });
  }
  
  
  incrementQuantity(index: number): void {
    this.cartItems[index].quantity++;
    this.cartService.updateCartCount();
  }

  decrementQuantity(index: number): void {
    this.cartItems[index].quantity--;
  
    if (this.cartItems[index].quantity <= 0) {
      this.cartService.removeFromCart(index);
      this.cartItems = this.cartService.getCartItems();
    } else {
      this.cartService.updateCartCount();
    }
    this.cartService.syncCartToServer();
  }
  
  
  
  // removeItem(index: number) {
  //   this.cartService.removeFromCart(index);
  //   this.cartItems = this.cartService.getCartItems();
  // }
  cancelOrder() {
    this.showOrderForm = false;
  }

  
  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  
  
}
