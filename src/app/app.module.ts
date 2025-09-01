import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { SearchComponent } from './search/search.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { SavedAddressComponent } from './components/saved-address/saved-address.component';
import { SelectlanguageComponent } from './components/selectlanguage/selectlanguage.component';
import { TermsComponent } from './components/terms/terms.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        NavbarComponent,
        ProductsComponent,
        ProductDetailComponent,
        CartComponent,
        SigninComponent,
        SignupComponent,
        SearchComponent,
        EditProfileComponent,
        SavedAddressComponent,
        SelectlanguageComponent,
        TermsComponent,
        CheckoutComponent,
        OrderSuccessComponent,
        AddProductComponent,
        ForgotPasswordComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
