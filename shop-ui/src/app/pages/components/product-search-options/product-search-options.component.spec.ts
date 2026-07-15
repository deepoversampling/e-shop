import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchOptionsComponent } from './product-search-options.component';

describe('ProductSearchOptionsComponent', () => {
  let component: ProductSearchOptionsComponent;
  let fixture: ComponentFixture<ProductSearchOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSearchOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
