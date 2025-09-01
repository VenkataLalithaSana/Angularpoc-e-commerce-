import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmpassword = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSignUp(): void {
    this.error = '';
    // Step 1: Check if passwords match
    if (this.password !== this.confirmpassword) {
      this.error = 'Passwords do not match.';
      return;
    }
  
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe(result => {
      console.log(result, 'signup result');
  
      if (result === true) {
        this.router.navigate(['/signin']);
      } else if (typeof result === 'string' && result.toLowerCase().includes('already')) {
        this.error = result; 
      } else if (result) {
        this.router.navigate(['/signin']);
      } else {
        this.error = 'Signup failed. Try again.';
      }
    });
  }
  
  
  
}
