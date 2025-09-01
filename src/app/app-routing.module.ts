import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { SavedAddressComponent } from './components/saved-address/saved-address.component';
import { SelectlanguageComponent } from './components/selectlanguage/selectlanguage.component';
import { TermsComponent } from './components/terms/terms.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },

  { path: 'account/profile', component: EditProfileComponent },
  { path: 'account/address', component: SavedAddressComponent },
  { path: 'account/language', component: SelectlanguageComponent },
  // { path: 'account/notifications', component: NotificationSettingsComponent },
  { path: 'account/terms', component: TermsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  { path: 'addProducts', component: AddProductComponent },
  { path: 'forgot', component: ForgotPasswordComponent }, // Assuming you have a forgot password component
  { path: '**', component: HomeComponent} // Assuming this is for adding products
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
