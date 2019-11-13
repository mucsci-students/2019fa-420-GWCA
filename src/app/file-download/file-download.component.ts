import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: ['./file-download.component.css']
})
export class FileDownloadComponent implements OnInit {

  fileURL;

  constructor(private sanatizer: DomSanitizer) { }

  ngOnInit() {
    const exportedJSON = "Test data"// TODO: retrieve jsonString
    const blob = new Blob([exportedJSON], { type: 'application/json' });

    this.fileURL = this.sanatizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

  }

}
