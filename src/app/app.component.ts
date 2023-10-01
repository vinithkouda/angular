import { Component, ElementRef, ViewChild } from '@angular/core';
import { CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'grid-app';
  @ViewChild('canvasElement', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  canvasWidth = 800; // Initial canvas width
  canvasHeight = 600; // Initial canvas height

  constructor() { }

  onObjectDrag(event: CdkDragMove) {
    const x = event.source.getFreeDragPosition().x;
    const y = event.source.getFreeDragPosition().y;
  
    // Check if the object is near the canvas edge and expand if needed
    const expandThreshold = 50; // Adjust as needed
    if (x + expandThreshold > this.canvasWidth) {
      this.canvasWidth += expandThreshold;
    }
    if (y + expandThreshold > this.canvasHeight) {
      this.canvasHeight += expandThreshold;
    }
  
    // Update the canvas element's dimensions
    this.canvas.nativeElement.width = this.canvasWidth;
    this.canvas.nativeElement.height = this.canvasHeight;
  }
}
