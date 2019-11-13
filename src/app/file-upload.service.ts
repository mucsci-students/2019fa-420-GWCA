import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(private httpClient : HttpClient) { }

  postFile(fileToUpload: File): Observable<boolean> {
    const endpoint = 'your-destination-url';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(endpoint, formData, { headers: new HttpHeaders })
      .pipe(map(() => { return true; }))
      .pipe(catchError((e) => this.handleError(e)));
  }

  private handleError(error: any) {
    console.error('An error has occured', error);
    return Promise.reject(error);
  }
}
