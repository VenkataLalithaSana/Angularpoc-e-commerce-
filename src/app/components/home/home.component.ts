import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  launchingProducts: any[] = [];
  loggedInUser: string | null = localStorage.getItem('user');

  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    // this.productService.getProducts().subscribe((data) => {
    //   this.products = data.filter((p: { featured: boolean; newLaunch: boolean; }) => p.featured === true || p.newLaunch === true); // assuming 'newLaunch' or 'featured' flag
    // });   
    this.loadLaunchingProducts();
  }
  loadLaunchingProducts() {
    this.productService.getLaunchingProducts().subscribe({
      next: data => {
        console.log('Launching products:', data);
        this.launchingProducts = data;
      },
      error: err => console.error('Error loading launching products', err)
    });
  }
  // getRandomProducts(products: any[], count: number): any[] {
  //   const shuffled = products.sort(() => 0.5 - Math.random());
  //   return shuffled.slice(0, count);
  // }
}

