import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-product',
    styleUrls: ['./add-product.component.css'],
    templateUrl: './add-product.component.html',
    standalone: false
})
export class AddProductComponent {
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService, private router:Router) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required, this.categoryValidator(['Electronics', 'Clothing', 'Books'])]],
      image: ['', [Validators.required, Validators.pattern('(https?://.*\\.(?:png|jpg|jpeg|gif|webp))')]],
      rating: [null, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value).subscribe({
        next: (response) => {
          this.productForm.reset();
          alert('Product added successfully!');
        },
        error: (error) => {
          alert('Failed to add product. Please try again.');
        }
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
  onRatingInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = parseFloat(input.value);
  
    if (isNaN(val)) return;
  
    if (val > 5) {
      val = 5;
      input.value = val.toString();
      this.productForm.get('rating')?.setValue(val, { emitEvent: false });
    } else if (val < 0) {
      val = 0;
      input.value = val.toString();
      this.productForm.get('rating')?.setValue(val, { emitEvent: false });
    }
  }
  categoryValidator(allowed: string[]) {
    return (control: AbstractControl) => {
      const value = control.value?.trim();
      return allowed.includes(value) ? null : { invalidCategory: true };
    };
  }
  goBack() {
    this.router.navigate(['/home']);
  }
  
}
