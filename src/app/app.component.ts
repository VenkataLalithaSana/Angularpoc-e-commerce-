import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  showNavbar: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Listen for route changes to hide the navbar on specific pages
    this.router.events.subscribe((event) => {
      if (this.router.url === '/signin' || this.router.url === '/signup') {
        this.showNavbar = false;
      } else {
        this.showNavbar = true;
      }
    });
  }
}
