import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {
  email = '';
  password = '';
  error = '';
  message = ''; // ✅ New field
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
  this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.message = params['message'];

        // ✅ Remove message from URL after showing (optional: short delay)
        setTimeout(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true,
          });
        }, 5000); // Message disappears after 5 seconds (adjust if needed)
      }
    });
  }
  
  onSignIn(): void {
    const success =this.auth.signin(this.email, this.password).subscribe(user => {      
      if (user && user._id) {
        localStorage.setItem('userId', user._id); // ✅ Make sure this line exists
        localStorage.setItem('user', user?.username); 
        this.router.navigate(['/home']);
       
      } else {
        this.error = 'Invalid login';
      }
    });
    
    
    // const success = this.auth.signin(this.email, this.password);
    // if (success) {
    //   this.router.navigate(['/home']);
    // } else {
    //   this.error = 'Invalid email or password.';
    // }
  }
}
