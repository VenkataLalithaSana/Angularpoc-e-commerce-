import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  cartItems:any;
  userId = localStorage.getItem('userId') || '';
  searchTerm: string = '';
  username: any = '';
  loggedInUser: any;
  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {
      // this.cartCount = items.products.length; 
      this.cartService.fetchCartFromServer().subscribe(res=>{
        this.cartCount = res.products.length;
      });
 
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('user') || '';   
    this.loggedInUser = this.username;  
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  
    // Optionally fetch cart when user logs in or page reloads
    this.cartService.fetchCartFromServer().subscribe();
  
  }
  onLogout() {
    this.authService.logout();
   localStorage.clear()
   
    this.router.navigate(['/signin']);
  }

}
