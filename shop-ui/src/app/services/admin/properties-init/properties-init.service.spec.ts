import { TestBed } from '@angular/core/testing';

import { PropertiesInitService } from './properties-init.service';

describe('PropertiesInitService', () => {
  let service: PropertiesInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertiesInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
