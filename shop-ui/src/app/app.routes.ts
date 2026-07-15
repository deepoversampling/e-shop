import {Routes} from '@angular/router';
import {SearchComponent} from './pages/search/search.component';
import {authGuard} from './services/guard/auth.guard';
import {SuccessPageComponent} from './modules/user/pages/carts/components/success-page/success-page.component';
import {FailurePageComponent} from './modules/user/pages/carts/components/failure-page/failure-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'success',
    component: SuccessPageComponent
  },
  {
    path: 'failure',
    component: FailurePageComponent
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then(m => m.UserModule),
    canActivate: [authGuard('USER')]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard('ADMIN')]
  }
];
