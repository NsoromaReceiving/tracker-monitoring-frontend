import { TestBed } from '@angular/core/testing';

import { APIcallsService } from './apicalls.service';

describe('APIcallsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: APIcallsService = TestBed.get(APIcallsService);
    expect(service).toBeTruthy();
  });
});
