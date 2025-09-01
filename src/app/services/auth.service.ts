import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  signup(userData: { name: string; email: string; password: string }): Observable<any> {
    const payload = {
      username: userData.name,
      email: userData.email,
      password: userData.password
    };
  
    return this.http.post(`${this.baseUrl}/register`, payload, { observe: 'response' }).pipe(
      map(response => {
        if (response.status === 201) return true;
        return false;
      }),
      catchError(error => {
        if (error.status === 409) {
          return of('Email already registered');
        }
        return of('Signup failed. Try again.');
      })
    );
  }
  signin(email: string, password: string): Observable<any> {
    return this.http.post<User>(`${this.baseUrl}/login`, { email, password }).pipe(
      map(user => {
        if (user && user._id) {
          this.currentUser = user;
          localStorage.setItem('userId', user._id); 
        }
        return user;
      }),
      catchError(err => {
        console.error('Signin failed:', err);
        return of(null);
      })
    );
  }
  
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }
}