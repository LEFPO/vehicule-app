import { TestBed } from '@angular/core/testing';

import { NhtsaService } from './nhtsa';

describe('Nhtsa', () => {
  let service: NhtsaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NhtsaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
