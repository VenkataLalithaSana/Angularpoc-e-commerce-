import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    standalone: false
})
export class ProductsComponent implements OnInit {
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.allProducts = products;
      this.route.queryParams.subscribe((params) => {
        const category = params['category'];
        if (category) {
          this.filteredProducts = this.allProducts.filter(p => p.category === category);
        } else {
          this.filteredProducts = this.allProducts;
        }
      });
    });
    this.onSearch();
  }
 
  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
  
    if (!query) {
      this.filteredProducts = this.allProducts; // Reset to full list
      return;
    }
  
    this.filteredProducts = this.filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }
  
}


