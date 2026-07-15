import { TestBed } from '@angular/core/testing';

import { CartsInitService } from './carts-init.service';

describe('CartsInitService', () => {
  let service: CartsInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartsInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
