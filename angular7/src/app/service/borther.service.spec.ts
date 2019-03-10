import { TestBed } from '@angular/core/testing';

import { BortherService } from './borther.service';

describe('BortherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BortherService = TestBed.get(BortherService);
    expect(service).toBeTruthy();
  });
});
