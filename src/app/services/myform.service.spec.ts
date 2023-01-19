import { TestBed } from '@angular/core/testing';

import { MyformService } from './myform.service';

describe('MyformService', () => {
  let service: MyformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
