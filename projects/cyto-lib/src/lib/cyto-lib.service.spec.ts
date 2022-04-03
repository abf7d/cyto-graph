import { TestBed } from '@angular/core/testing';

import { CytoLibService } from './cyto-lib.service';

describe('CytoLibService', () => {
  let service: CytoLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CytoLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
