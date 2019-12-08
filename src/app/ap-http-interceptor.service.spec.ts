import { TestBed } from '@angular/core/testing';

import { ApHttpInterceptorService } from './ap-http-interceptor.service';

describe('ApHttpInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApHttpInterceptorService = TestBed.get(ApHttpInterceptorService);
    expect(service).toBeTruthy();
  });
});
