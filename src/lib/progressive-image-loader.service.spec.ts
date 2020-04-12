import { TestBed } from '@angular/core/testing';

import { ProgressiveImageLoaderService } from './progressive-image-loader.service';

describe('ProgressiveImageLoaderService', () => {
  let service: ProgressiveImageLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressiveImageLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
