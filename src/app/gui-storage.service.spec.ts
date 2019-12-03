import { TestBed } from '@angular/core/testing';

import { GuiStorageService } from './gui-storage.service';

describe('GuiServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuiStorageService = TestBed.get(GuiStorageService);
    expect(service).toBeTruthy();
  });
});
