import { TestBed } from '@angular/core/testing';

import { ProductsInitService } from './products-init.service';

describe('ProductsInitService', () => {
  let service: ProductsInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
