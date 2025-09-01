import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.css'],
    standalone: false
})
export class TermsComponent {
  termsHtml: string = '';

  constructor(private http: HttpClient, private route:Router) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/api/terms', { responseType: 'text' })
      .subscribe(data => {
        this.termsHtml = data;
      }, error => {
        console.error('Failed to load terms', error);
      });
  }
  goBack() {
    this.route.navigate(['/home']);
  }
}
