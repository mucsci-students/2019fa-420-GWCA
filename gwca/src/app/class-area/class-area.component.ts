import { Component, OnInit, ViewContainerRef,ViewChild,ComponentFactoryResolver, IterableDiffer, IterableDiffers, SimpleChanges, KeyValueDiffers, OnChanges, DoCheck, AfterViewInit, AfterViewChecked, AfterContentInit, OnDestroy } from '@angular/core';
import { ClassBoxComponent } from '../class-box/class-box.component';
import { ClassStorageService } from '../class-storage.service';
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { jsPlumb } from 'jsplumb';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-class-area',
  templateUrl: './class-area.component.html',
  styleUrls: ['./class-area.component.css']
})
export class ClassAreaComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
  switchToCLI: boolean;
 
  //NOTE: this is testing, ignore for now

  @ViewChild('container',{static:true,read: ViewContainerRef}) ref;
  //listen for changes in arrays (insertions / deletions)
  private iterableDiffer: IterableDiffer<object>;
  constructor(private resolver: ComponentFactoryResolver,public service: ClassStorageService
    ,public dialog: MatDialog, private iterableDiffs: IterableDiffers,
    private router: Router) {
      this.iterableDiffer= this.iterableDiffs.find([]).create(null);


      router.events.subscribe(event  => {
        if(event instanceof NavigationEnd){
          // this.switchToCLI = true;
          if(router.url == '/'){

          }

        }

        if(event instanceof NavigationStart){
          if(router.url !== '/cli'){
            this.connectionsUpdateWrapper();
            this.removeAll();
            // this.classBoxes = [];
          }
        }
        });
     }


  ngOnInit() {
    this.classBoxes = [];
  }

  //listen for insertion into array of "classes" and on insert create the class
  ngDoCheck(){
    let changes = this.iterableDiffer.diff(this.service.allClasses);
    if(changes){
        changes.forEachAddedItem(r =>
           this.updateBackend()
        );
    }
  }

  ngOnDestroy(){
    this.classBoxes = [];
  }

    //set up jsplumb instance after the view has initialized
    ngAfterViewInit(){
      this.service.jsPlumbInstance = jsPlumb.getInstance({
        DragOptions: {
          drag: function(){

          }
        },

      });
      this.service.jsPlumbInstance.setContainer("classes-container");
      //this.service.jsPlumbInstance.reset();
      this.service.revertLeftShift();
  
  
      
      
      var classes = this.service.allClasses;
  
      //empty back-end for re-insertion
      this.service.allClasses = [];
      //this.classBoxes = [];
  
      if(classes.length != 0){
        var class_boxes = document.querySelectorAll("app-class-box");
        //re-initialize data
        for(var i = 0;i<class_boxes.length;i++){

          this.service.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Top",uuid:(class_boxes[i]['firstChild']['attributes'][3].value+"_top")},this.service.common);
          this.service.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Bottom",uuid:(class_boxes[i]['firstChild']['attributes'][3].value+"_bottom")},this.service.common);
          this.service.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Right",uuid:(class_boxes[i]['firstChild']['attributes'][3].value+"_right")},this.service.common);
          this.service.jsPlumbInstance.addEndpoint(class_boxes[i]['childNodes'][0]['id'],{anchor:"Left",uuid:(class_boxes[i]['firstChild']['attributes'][3].value+"_left")},this.service.common);
          
          // //re-bind the "no link to self rule"
          var jsPlumbInstance = this.service.jsPlumbInstance;
          this.service.jsPlumbInstance.bind("connection",function(endpoint){
              if(endpoint['source']['attributes'][4].value == endpoint['target']['attributes'][4].value){
                var connection = jsPlumbInstance.getConnections({source: endpoint['source']['attributes'][4].value,target: endpoint['target']['attributes'][4].value });
                jsPlumbInstance.deleteConnection(connection[0]);
              }
           });
           this.service.jsPlumbInstance.draggable(class_boxes[i]['childNodes'][0]['id'],{
             drag:function(endpoint){
              //  jsPlumbInstance.selectEndpoints({source: endpoint['el']}).each(function(point){
              //   // (<HTMLElement>point).style.left = endpoint.pos[0];
              //   // (<HTMLElement>point).style.top = endpoint.pos[1];

              //  });
             }
           });
        }

        // var endpoints = document.querySelectorAll('div.jtk-endpoint');
        // this.service.jsPlumbInstance.draggable(endpoints,{
        //   drag: function(event){
        //     (<HTMLElement>event.el).style.left = event.pos[0];
        //     (<HTMLElement>event.el).style.top = event.pos[1];
        //   },
        //   container: true,
        //   DoNotThrowErrors: true,

        // });

        //re-connect connections
         for(var i = 0;i<classes.length;i++){
           if(classes[i]['connections'].length !== 0){
             for(var j = 0;j<classes[i]['connections'].length;j++){
              this.service.jsPlumbInstance.connect({uuids: [classes[i]['connections'][j][0],classes[i]['connections'][j][1]]});
            }
          }
         }
  
  
      }
  
    }


  
  test(){
    var endpoints = this.service.jsPlumbInstance.getSelector('.jtk-endpoint');
        console.log(endpoints);
  }


  removeAll(){
    //remove the classes and endpoints
    this.service.jsPlumbInstance.reset();

    //"delete" the elements (just hide them)
      var class_boxes = document.querySelectorAll(".class-box");
      for(var i = 0;i<class_boxes.length;i++){
        //(<HTMLElement>class_boxes[i]).style.display = "none";
        class_boxes[i].remove();
      }

    //  var endpoints = document.querySelectorAll("div.jtk-endpoint");
    //  for(var i = 0;i<endpoints.length;i++){
    //    (<HTMLElement>endpoints[i]).style.display = "none";
    //  }

    
  }

  //update backend
  updateBackend(){
    //console.log(this.service.generate());
    var generated = document.getElementsByClassName(this.service.generate().name);
    if(generated.length == 0){
      this.createClass();
      this.service.pruneArray();
    }
  }

   //find the class in the back-end array and add the connection
   insertConnection(source:string, target: string){
    var sourceClass = source.split("_")[0];
    console.log(sourceClass);
     var connections = this.service.findClass(sourceClass)['connections'];
     if(connections.length == 1){
       if(connections[0] !== [source,target]){
         this.service.findClass(sourceClass)['connections'].push([source,target]);
       }
     }
     else if(connections.length == 0){
       this.service.findClass(sourceClass)['connections'].push([source,target]);
     }
     else{
       for(var i = 0; i< connections.length;i++){
         if(connections[i] == [source,target]){
           return;
         }
       }
       this.service.findClass(sourceClass)['connections'].push([source,target]);
     }
  }
 

  updateConnections() : string[][] {
    //find all classes in the DOM and then iterate through all of them and add connections to the back-end
    var elements = document.querySelectorAll('.class-box');
    var all_connections: string[][] = [];
    for(var i = 0;i< elements.length;i++){
      //var connections = this.service.jsPlumbInstance.getConnections({source: elements[i].id});
      this.service.jsPlumbInstance.selectEndpoints({source:elements[i].id}).each(function(endpoint){

        if(endpoint['connections'].length != 0){
          //find element in DOM
          for(var j = 0;j<endpoint['connections'].length;j++){
            if(endpoint['connections'][j]['endpoints'][0] == endpoint){
              var target = endpoint['connections'][j]['endpoints'][1].getUuid();
              var source = endpoint.getUuid();
              all_connections.push([source,target]);
            }
          }
        }
      });
    }
    return all_connections;
  }

  //wrapper for updating the connections
  connectionsUpdateWrapper(){
    var connections = this.updateConnections();
    for(var i = 0;i<connections.length;i++){
      this.insertConnection(connections[i][0],connections[i][1]);
    }
  }
  




  //dialog
  public dialogRef: MatDialogRef<DialogTestComponent>
  openDialog(buttonName){
    this.switchToCLI = false;
    //insert component here to generate and remove component
    this.dialogRef = this.dialog.open(DialogTestComponent, {width: '250px'});

    switch(buttonName){
      case 'new':
        this.dialogRef.componentInstance.buttonPressed = "new";
        this.dialogRef.componentInstance.name = "New Button";
        break;
      case 'edit':
        this.dialogRef.componentInstance.buttonPressed = "edit";
        this.dialogRef.componentInstance.name = "Edit Button";
        break;
      case 'import':
        this.dialogRef.componentInstance.buttonPressed = "import";
        this.dialogRef.componentInstance.name = "Import Button";
        break;
      case 'export':
        this.dialogRef.componentInstance.buttonPressed = "export";
        this.dialogRef.componentInstance.name = "Export Button";
        break;
    }
    //listen for close without submit
    this.dialogRef.backdropClick().subscribe(() => {
      this.switchToCLI = true;
    });
    //listen for normal close
    this.dialogRef.afterClosed().subscribe(() => {
      this.switchToCLI = true;
    });
  }
  //generate components (new way) in the view
  classBoxes = [];

  createClass(){
      const factory = this.resolver.resolveComponentFactory(ClassBoxComponent);
      //  const temp = this.ref.createComponent(factory);
      //  temp.instance.name = this.service.generate().name;
      //  temp.instance.methods = this.service.generate().methods;
      //  temp.instance.variables = this.service.generate().variables;
      this.classBoxes.push(factory);
  }

  drop(event: CdkDragDrop<ClassBoxComponent[]>){
    moveItemInArray(this.classBoxes,event.previousIndex,event.currentIndex);
  }

  updateStoredDiagram(){
    this.service.diagramToJSON();
  }  
}
