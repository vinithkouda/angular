import { Component, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { BasicShapeModel, DiagramComponent, NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { Subscription } from 'rxjs';
import * as ace from "ace-builds";
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit , OnDestroy{
  private aceEditor! :ace.Ace.Editor;
  title = 'grid-app';
  @ViewChild("diagram") public diagram?: DiagramComponent;
  public shape?: BasicShapeModel;
  private subscriptions: Subscription[] = [];
  private previouslySelectedNode: NodeModel | null = null;
  @ViewChild("editor") private editor!: ElementRef<HTMLElement>;
  
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private ctx: CanvasRenderingContext2D | null = null;

  
  

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (!this.ctx) {
      console.error('Canvas context not available');
      return;
    }
  
    // Convert the SVG pattern into a data URL
    const svgPattern = `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dottedGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle width="100%" cx="1" cy="1" r="1" fill="rgba(0, 0, 0, 0.25)"></circle>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#dottedGrid)"></rect>
      </svg>
    `;
    
    const patternImage = new Image();
    patternImage.src = `data:image/svg+xml;base64,${btoa(svgPattern)}`;
  
    // Wait for the image to load
    patternImage.onload = () => {
      // Create a pattern fill using the loaded image
      const pattern = this.ctx!.createPattern(patternImage, 'repeat');
  
      // Set the fill style to the pattern
      if (pattern) {
        this.ctx!.fillStyle = pattern;
      } else {
        console.error('Pattern not created');
        return;
      }
  
      // Fill the entire canvas with the pattern
      this.ctx!.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  
    };
  }


  ngAfterViewInit(): void {

    ace.config.set("fontSize", "14px");
    ace.config.set(
      "basePath",
      "https://unpkg.com/ace-builds@1.4.12/src-noconflict"
    );
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.session.setValue("<h1>Ace Editor works!</h1>");
    this.aceEditor.setTheme("ace/theme/twilight");
    this.aceEditor.session.setMode("ace/mode/html");
    this.aceEditor.on("change", () => {
      console.log(this.aceEditor.getValue());
    });

  }

 

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions in the array when the component is destroyed
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  workspace1Items: string[] = ['Item 1', 'Item 2', 'Item 3'];
  workspace2Items: string[] = ['Item 4']; // Define an empty array for the second workspace

  // onDrop(event: CdkDragDrop<string[]>, workspaceItems: string[]) {
  //   if (event.previousContainer === event.container) {
  //     // Reorder within the same list
  //     moveItemInArray(workspaceItems, event.previousIndex, event.currentIndex);
  //   } else {
  //     // Transfer between lists
  //     copyArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }

  canvasItems: string[] = [];

  onDrop(event: CdkDragDrop<string[]>, workspaceItems: string[]) {
    if (event.previousContainer === event.container) {
      // Reorder within the same list
      moveItemInArray(workspaceItems, event.previousIndex, event.currentIndex);
    } else if (event.container.id === "list3") { // Check the id instead of the element
      // Handle drop onto the canvas
      // You can do something with the dropped item here
      // For example, you can draw it on the canvas
      const droppedItem = event.item.data;
      this.drawOnCanvas(droppedItem);
    } else {
      // Transfer between lists
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  // drop(event: CdkDragDrop<string[]>) {
  //   var self=this;
  //   if (event.previousContainer === event.container) {    
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   }
  //   else if(event.container.id<event.previousContainer.id){
  //     transferArrayItem(event.previousContainer.data,
  //                       event.container.data,
  //                       event.previousIndex,
  //                       event.currentIndex); 
       
  //      this.todo=this.todo.filter(function(item, pos){
  //                 return self.todo.indexOf(item)== pos; 
  //               });
  //   }
  //   else {
  //     copyArrayItem(event.previousContainer.data,
  //                       event.container.data,
  //                       event.previousIndex,
  //                       event.currentIndex); 
  //     this.done=this.done.filter(function(item, pos){
  //                 return self.done.indexOf(item)== pos; 
  //               });
  //   }
   
  // }
  
  
  drawOnCanvas(item: string) {
    // Here, you can implement the logic to draw the dropped item on the canvas.
    // You can use this.ctx and the canvas element to perform your drawing operations.
    // Example: Draw text on the canvas
    this.ctx?.fillText(item, 50, 50);
  }


}
