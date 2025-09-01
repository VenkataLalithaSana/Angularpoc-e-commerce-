import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private dataUrl = 'http://localhost:3000/data';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.dataUrl)
  }
  getProductById(id: any): Observable<any | undefined> {
   const product= this.http.get<any[]>(this.dataUrl).pipe(
      map((data) => data.find((p: any) => p._id === id))
    );
    return product;
    
  }
  addProduct(product: any): Observable<any> {
    return this.http.post('http://localhost:3000/data', product);
  }
  getLaunchingProducts(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/launches');
  }
}

