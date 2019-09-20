import { TestBed } from '@angular/core/testing';

import { ClassStorageService } from './class-storage.service';

describe('ClassStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClassStorageService = TestBed.get(ClassStorageService);
    expect(service).toBeTruthy();
  });
});
