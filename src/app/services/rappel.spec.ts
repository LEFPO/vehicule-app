import { TestBed } from '@angular/core/testing';

import { RappelService } from './rappel';

describe('Rappel', () => {
  let service: RappelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RappelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
