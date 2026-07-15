import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductVariantComponent } from './create-product-variant.component';

describe('CreateProductVariantComponent', () => {
  let component: CreateProductVariantComponent;
  let fixture: ComponentFixture<CreateProductVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProductVariantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProductVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
