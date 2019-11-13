import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  fileToUpload: File = null;

  constructor() { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFileToActivity() {
    //FileUploadService.postFile(this.fileToUpload).subscribe(data => {
      // do something, if upload success
    //  }, error => {
        //console.log(error);
      //});
  }
}
