import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CategoryListComponent} from './pages/categories/category-list/category-list.component';
import {PropertyListComponent} from './pages/properties/property-list/property-list.component';
import {
  CategoryTemplateListComponent
} from './pages/category-templates/category-template-list/category-template-list.component';

const routes: Routes = [
  {
    path: 'categories',
    component: CategoryListComponent
  },
  {
    path: 'properties',
    component: PropertyListComponent
  },
  {
    path: 'category-templates',
    component: CategoryTemplateListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
