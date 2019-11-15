import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ClassStorageService } from '../class-storage.service';

@Component({
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: ['./file-download.component.css']
})
export class FileDownloadComponent implements OnInit {

  fileURL: any;
  exportedJSON : string;
  blob : Blob;

  constructor(private sanatizer: DomSanitizer, public service: ClassStorageService) { }

  ngOnInit() {
    this.service.diagramToJSON();
    this.exportedJSON = this.service.jsonString;
    this.blob = new Blob([this.exportedJSON], { type: 'application/json' });
    this.fileURL = this.sanatizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(this.blob));
  }



  downloadDiagram(){
    this.service.diagramToJSON();
    this.exportedJSON = this.service.jsonString;
    this.blob = new Blob([this.exportedJSON], { type: 'application/json' });
    this.fileURL = this.sanatizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(this.blob));
  }

}
