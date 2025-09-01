import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems: any;
  private count: any; // Initialize count to 0
  private cartCount = new BehaviorSubject<number>(0);
  private cartItemsSubject = new BehaviorSubject<any[]>([]);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = this.cartCount.asObservable();

  private baseUrl = 'http://localhost:3000'; // Backend API
  // private userId = localStorage.getItem('userId') || 'guest';

  constructor(private http: HttpClient) {
    // this.countcart();
  }
  private getUserId(): string {
    return localStorage.getItem('userId') || 'guest';
  }
  fetchCartFromServer() {
    const getUserId=localStorage.getItem('userId');
    if (!getUserId) return of()
      
    
    return this.http.get<any>(this.baseUrl + '/cart/' + this.getUserId()).pipe(
      tap(response => {
        this.cartItems = response.products;     
        this.cartItemsSubject.next(this.cartItems);
        // const totalQuantity = this.cartItems.reduce((sum: any, item: any) => sum + item.quantity, 0);
        this.cartCount.next(this.cartItems.length);
      })
    );
  }
  getCartItems() {
    return this.cartItems || [];
  }

  addToCart(product: any) {
    const currentItems = this.cartItemsSubject.getValue();
    const existingItemIndex = currentItems.findIndex(item => item._id === product._id);
  
    let updatedItems;
  
    if (existingItemIndex > -1) {
      // Update quantity only
      currentItems[existingItemIndex].quantity += 1;
      updatedItems = [...currentItems];
      this.cartItemsSubject.next(updatedItems);
      this.cartItems = updatedItems;
     
    } else {
      // New product — increase cart count
      const newProduct = { ...product, quantity: 1 };
      updatedItems = [...currentItems, newProduct];
      this.cartItemsSubject.next(updatedItems);
      this.cartItems = updatedItems;
      this.updateCartCount(); // ✅ Only called here
    }
  
    const payload = {
      userId: this.getUserId(),
      products: updatedItems,
    };
  
    this.http.post(`${this.baseUrl}/cart/${this.getUserId()}`, payload).subscribe(
      res => console.log('Cart updated:', res),
      err => console.error('Cart update failed:', err)
    );
  }
  
  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
    this.cartItemsSubject.next(this.cartItems);
    this.updateCartCount();
    this.syncCartToServer();
  }
  

  updateCartCount() {
    const items = this.cartItemsSubject.getValue();
    this.cartCount.next(items.length); // Only count distinct products
  }
  
  clearCart(userId: string) {
    this.cartItems = [];
    this.cartItemsSubject.next([]);
    this.cartCount.next(0);
    // this.syncCartToServer();
    return this.http.delete(`http://localhost:3000/cart/${userId}`);
  }
  
  syncCartToServer() {
    this.http
      .post(`${this.baseUrl}/cart/${this.getUserId()}`, {
        userId: this.getUserId(),
        products: this.cartItems,
      })
      .subscribe(() => this.updateCartCount());
  }
  placeOrder(orderData: any) {
    return this.http.post(`${this.baseUrl}/orders`, orderData);
  }
}
