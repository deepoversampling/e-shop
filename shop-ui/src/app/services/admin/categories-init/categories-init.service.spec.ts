import { TestBed } from '@angular/core/testing';

import { CategoriesInitService } from './categories-init.service';

describe('AdminInitService', () => {
  let service: CategoriesInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
