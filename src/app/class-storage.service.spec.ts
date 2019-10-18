import { TestBed, async } from '@angular/core/testing';

import { ClassStorageService, fullClass } from './class-storage.service';

describe('ClassStorageService', () => {
  let service: ClassStorageService;
  let test: fullClass;
  let test2: fullClass;
  beforeEach(() => TestBed.configureTestingModule({}));
  
  beforeEach(async(() => {
    service = TestBed.get(ClassStorageService);
    test = {"name":"cherry","methods":["m1()","m2()","m3()"],"variables":["v1","v2","v3"],"connections":[]};
    test2 = {"name":"cherry","methods":["m1()","m2()"],"variables":["v1","v2","v3"],"connections":[]};
  }));


  it('should be created', () => {
    // const service: ClassStorageService = TestBed.get(ClassStorageService);
    expect(service).toBeTruthy();
  });

  it('should insert into class array',() => {
   service.createNew('cherry',['m1()','m2()','m3()'],['v1','v2','v3']);
   expect(service.allClasses).toContain(test);
  });

  it('should return the first element in the array',() => {
    service.createNew('cherry',['m1()','m2()','m3()'],['v1','v2','v3']);
    expect(service.generate()).toEqual(test);
  });

  it('should find nothing', () => {
    service.createNew('apple',['m1()','m2()','m3()'],['v1','v2','v3']);
    expect(service.findClass(test.name)).toBeNull();
  });

  it('should find the class',() => {
    service.createNew('cherry',['m1()','m2()','m3()'],['v1','v2','v3']);
    expect(service.findClass(test.name)).toEqual(test);
  });

  it('should only have one instance of the class', () => {
    service.createNew('cherry',['m1()','m2()','m3()'],['v1','v2','v3']);
    service.createNew('cherry',['m1()','m2()'],['v1','v2','v3']);
    service.pruneArray();
    expect(service.allClasses).toContain(test2);
  });

   it('should return the first value',() => {
     service.createNew(test.name,test.methods,test.variables);
     const output = service.generate();
     expect(output).toEqual(test);
   });


   it('should find the class in the array',() => {
     service.createNew(test.name,test.methods,test.variables);
     service.createNew(test2.name,test2.methods,test2.variables);
     expect(service.findClass(test2.name)).toEqual(test2);
   });

   it('should not find anything',() => {
    service.createNew(test.name,test.methods,test.variables);
    expect(service.findClass("a")).toEqual(null);
   });

});
