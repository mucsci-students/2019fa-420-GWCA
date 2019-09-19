import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StorageService{


    constructor(){ }

    public test(){
        console.log("THIS IS A TEST");
    }

}