import { TestBed } from '@angular/core/testing';

import { ResourcesInitService } from './resources-init.service';

describe('ResourcesInitService', () => {
  let service: ResourcesInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
