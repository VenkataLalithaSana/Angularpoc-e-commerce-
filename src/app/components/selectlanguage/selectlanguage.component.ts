import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-selectlanguage',
    templateUrl: './selectlanguage.component.html',
    styleUrls: ['./selectlanguage.component.css'],
    standalone: false
})
export class SelectlanguageComponent {
  languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'zh', label: 'Chinese' },
  ];

  selectedLanguage = 'en';
  userId: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      alert('Please login first');
      this.router.navigate(['/signin']);
      return;
    }
    this.loadUserLanguage();
  }

  loadUserLanguage() {
    this.http.get<{ language: string }>(`http://localhost:3000/user/${this.userId}/language`)
      .subscribe(
        res => this.selectedLanguage = res.language,
        err => console.error('Failed to load language', err)
      );
  }

  onLanguageChange() {
    if (!this.userId) return;
    this.http.put(`http://localhost:3000/user/${this.userId}/language`, { language: this.selectedLanguage })
      .subscribe(
        () => {
          console.log('Language updated to', this.selectedLanguage);
        },
        err => console.error('Failed to update language', err)
      );
  }
}
