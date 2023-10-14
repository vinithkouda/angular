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

    

    this.shape = { type: "Basic", shape: "Rectangle" };
    if (this.diagram) {
      // Subscribe to the selectionChange event
      const selectionChangeSubscription = this.diagram.selectionChange.subscribe((args: any) => {
        // Check if a node is selected by verifying the type
        if (args.newValue.length > 0 && args.newValue[0].constructor.name === "Node") {
          const selectedNode = args.newValue[0];
          // Check if the newly selected node is different from the previously selected one
          if (this.previouslySelectedNode !== selectedNode) {
            console.log("Node selected:", selectedNode);
            // You can perform your custom actions here

            this.accessNodeContent(selectedNode.nodes[0]);

            // Update the previously selected node
            this.previouslySelectedNode = selectedNode;
          }
        }
      });

      this.subscriptions.push(selectionChangeSubscription);
    }

  }

  accessNodeContent(nod : NodeModel): void {
    if (this.diagram) {
      // Iterate through the nodes and find the one with the matching ID
      const node1 = this.diagram.nodes.find((node: NodeModel) => node.id === nod.id);
      if (node1) {
        const nodeContent: string | undefined = node1?.annotations?.[0]?.content;
        if (nodeContent !== undefined) {
          console.log("Node Content:", nodeContent);
          this.aceEditor.session.setValue(nodeContent);

          // You can also update the content if needed
          // node1.annotations[0].content = "New Content";
        } else {
          console.log("Node content is undefined.");
        }
      } else {
        console.log("Node not found.");
      }
    } else {
      console.log("Diagram component not found.");
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions in the array when the component is destroyed
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  workspace1Items: string[] = ['Item 1', 'Item 2', 'Item 3'];
  workspace2Items: string[] = []; // Define an empty array for the second workspace

  onDrop(event: CdkDragDrop<string[]>, workspaceItems: string[]) {
    if (event.previousContainer === event.container) {
      // Reorder within the same list
      moveItemInArray(workspaceItems, event.previousIndex, event.currentIndex);
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


}
