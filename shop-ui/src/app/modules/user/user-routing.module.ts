import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CartListComponent} from './pages/carts/cart-list/cart-list.component';
import {TransactionListComponent} from './pages/transactions/transaciton-list/transaction-list.component';
import {FeedbacksListComponent} from './pages/feedbacks/feedbacks-list/feedbacks-list.component';
import {ProductListComponent} from './pages/products/product-list/product-list.component';

const routes: Routes = [
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'carts',
    component: CartListComponent
  },
  {
    path: 'transactions',
    component: TransactionListComponent
  },
  {
    path: 'feedbacks',
    component: FeedbacksListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
