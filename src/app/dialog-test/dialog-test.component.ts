import { Component, OnInit, Input, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ClassStorageService } from '../class-storage.service';

@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrls: ['./dialog-test.component.css']
})

export class DialogTestComponent implements OnInit {
  @Input() buttonPressed: string;
  @Input() name: string;
  classNames: NodeListOf<Element>;
  classes: NodeListOf<Element>;
  choice: string;
  //input values for create new
  className: string;
  variables: string;
  methods: string;
  //export
  //import value
  diagram: string;
  //exportString: 
  connectionType: string;

  constructor(public service: ClassStorageService) { }

  ngOnInit() {
    this.choice = "";
    //gets class names to choose
    this.classNames = document.querySelectorAll("h2");
  }

  search(Name: string){
    this.className = this.service.findClass(Name)['name'];
    this.variables = this.service.findClass(Name)['variables'].join(',');
    this.methods = this.service.findClass(Name)['methods'].join(',');
    this.choice = 'found';

  }

  



  updateClass(){

    //update the back-end
    this.service.createNew(this.className,this.methods.split(','),this.variables.split(','));
    var cls = document.querySelector('.'+CSS.escape(this.className));
    
    //update
    //remove old endpoints
    this.service.jsPlumbInstance.reset();

    var class_boxes = document.querySelectorAll("app-class-box");

        //re-initialize data
        for(var i = 0;i<class_boxes.length;i++){
           this.service.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Top",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_top")},this.service.common);
           this.service.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Bottom",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_bottom")},this.service.common);
           this.service.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Right",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_right")},this.service.common);
           this.service.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Left",uuid:(class_boxes[i]['firstChild']['attributes']['id'].value+"_left")},this.service.common);
          
          // //re-bind the "no link to self rule"
          var jsPlumbInstance = this.service.jsPlumbInstance;
          this.service.jsPlumbInstance.bind("connection",function(endpoint){
              if(endpoint['source']['attributes'][4].value == endpoint['target']['attributes'][4].value){
                var connection = jsPlumbInstance.getConnections({source: endpoint['source']['attributes'][4].value,target: endpoint['target']['attributes'][4].value });
                jsPlumbInstance.deleteConnection(connection[0]);
              }
           });

        }


    var classes = this.service.allClasses;
    for(var i = 0;i<classes.length;i++){
      if(classes[i]['connections'].length !== 0){
        for(var j = 0;j<classes[i]['connections'].length;j++){
          //have to format the uuid a little to get the update element
         var source = classes[i]['connections'][j][0].split("_")[0];
         var sourcePosition = classes[i]['connections'][j][0].split("_")[1];
         var srcElement = document.querySelector("app-class-box ."+source).id;
         var target = classes[i]['connections'][j][1].split("_")[0]
         var targetPosition = classes[i]['connections'][j][1].split("_")[1];
         var targetElement = document.querySelector("app-class-box ."+target).id;

         var connectionType = classes[i]['connections'][j][2];
         this.service.jsPlumbInstance.connect({
           uuids:[(srcElement+"_"+sourcePosition),(targetElement+"_"+targetPosition)],
           paintStyle: {stroke: connectionType, lineWidth: '10px'},
         });
        }

     }
    }
    //cls.remove();
  }

  replaceUndefined(){
    if(this.methods === undefined){
      this.methods = 'none';
    }
    if(this.variables === undefined){
      this.variables = 'none';
    }
  }

  insertData(){
    //remove spaces and replace with underscores
    this.className = this.className.replace(/\s/g,"_");
    //check to see if input data
    this.replaceUndefined();
    this.service.createNew(this.className,this.methods.split(","),this.variables.split(","));
  }


  /*
  * importDiagram is basically just a wrapper for the service's import method.
  * This needs to be done because we can't directly call the service in the (click)
  * listener on line 65 of dialogue-test.component.html.
  */
  importDiagram(diagram){
    this.service.jsonToClasses(diagram);
  }

  updateStoredDiagram(){
    this.service.diagramToJSON();
  }  
}
