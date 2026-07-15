import { TestBed } from '@angular/core/testing';

import { SearchInitService } from './search-init.service';

describe('SearchInitService', () => {
  let service: SearchInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
