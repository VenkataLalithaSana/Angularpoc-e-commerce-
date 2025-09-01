import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';  // <-- Import SweetAlert2

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css'],
    standalone: false
})
export class ProductDetailComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id:any = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id).subscribe(data => {
      this.product = data;
    });
  
    // Ensure cart is synced before use
    this.cartService.fetchCartFromServer().subscribe();
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);

    // Show SweetAlert success message
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: `"${product.name}" has been added to your cart.`,
      timer: 1500,
      showConfirmButton: false,
    });
  }
}
