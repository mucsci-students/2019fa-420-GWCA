import { TestBed } from '@angular/core/testing';

import { ClassStorageService, fullClass } from './class-storage.service';

describe('ClassStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClassStorageService = TestBed.get(ClassStorageService);
    expect(service).toBeTruthy();
  });

  it('should insert into class array',() => {
    const service: ClassStorageService = TestBed.get(ClassStorageService);
    const test: fullClass = {"name":"apple","methods":["m1()","m2()","m3()"],"variables":["v1","v2","v3"]};
   service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
   expect(service.allClasses).toContain(test);
  });

  it('should return the first element in the array',() => {
    const service: ClassStorageService = TestBed.get(ClassStorageService);
    const test: fullClass = {"name":"cherry","methods":["m1()","m2()","m3()"],"variables":["v1","v2","v3"]};
    service.createNew('cherry',['m1()','m2()','m3()'],['v1','v2','v3']);
    expect(service.generate()).toEqual(test);
  });

  it('should find nothing', () => {
    const service: ClassStorageService = TestBed.get(ClassStorageService);
    const test: fullClass = {"name":"cherry","methods":["m1()","m2()","m3()"],"variables":["v1","v2","v3"]};
    service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
    expect(service.findClass(test.name)).toBeNull();
  });

  it('should find the class',() => {
    const service: ClassStorageService = TestBed.get(ClassStorageService);
    const test: fullClass = {"name":"cherry","methods":["m1()","m2()","m3()"],"variables":["v1","v2","v3"]};
    service.createNew('cherry',['m1()','m2()','m3()'],['v1','v2','v3']);
    expect(service.findClass(test.name)).toEqual(test);
  });

  it('should only have one instance of the class', () => {
    const service: ClassStorageService = TestBed.get(ClassStorageService);
    const test2: fullClass = {"name":"cherry","methods":["m1()","m2()"],"variables":["v1","v2","v3"]};
    service.createNew('cherry',['m1()','m2()','m3()'],['v1','v2','v3']);
    service.createNew('cherry',['m1()','m2()'],['v1','v2','v3']);
    service.pruneArray();
    expect(service.allClasses).toContain(test2);
  });


});
