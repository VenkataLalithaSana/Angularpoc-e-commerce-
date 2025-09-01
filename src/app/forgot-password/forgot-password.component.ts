import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    standalone: false
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    this.message = '';
    this.error = '';

    if (!this.email) {
      this.error = 'Email is required.';
      return;
    }

    this.http.post<{ message: string }>('http://localhost:3000/forgot-password', { email: this.email })
      .subscribe({
        next: (res) => {
          const msg = res.message || 'If this email is registered, a recovery link has been sent.';
          console.log(msg);
          
          // ✅ Redirect to signin with query param
          this.router.navigate(['/signin'], { queryParams: { message: msg } });
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to send recovery email. Please try again later.';
        }
      });
  }
}
