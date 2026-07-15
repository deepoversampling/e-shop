import { TestBed } from '@angular/core/testing';

import { CategoryTemplatesInitService } from './category-templates-init.service';

describe('CategoryTemplatesInitService', () => {
  let service: CategoryTemplatesInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryTemplatesInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
