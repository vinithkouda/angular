import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
  })
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private icons: { x: number; y: number; name: string }[] = [];
  private selectedIcon: { x: number; y: number , message: string} | null = null;

  constructor() { }

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
          <pattern id="dottedGrid" width="20" height="20" patternUnits="userSpaceOnUse">
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
  
      // Load your icons and draw them as before
      this.loadIcons();
      this.drawIcons();
    };
  }

  loadIcons() {
    // Add your icons' coordinates and names here
    this.icons.push({ x: 100, y: 100, name: 'Icon1' });
    this.icons.push({ x: 300, y: 100, name: 'Icon2' });
    // Add more icons as needed
  }

  drawIcons() {
    for (const icon of this.icons) {
      const textWidth = this.ctx!.measureText(icon.name).width;
      const textHeight = 14; // Assuming a fixed font size for simplicity
      const iconWidth = textWidth + 20; // Add padding
      const iconHeight = textHeight + 20; // Add padding

      this.ctx!.fillStyle = 'blue';
      this.ctx!.fillRect(icon.x, icon.y, iconWidth, iconHeight);
      this.ctx!.font = '14px Arial';
      this.ctx!.fillStyle = 'white';
      this.ctx!.fillText(icon.name, icon.x + 10, icon.y + 10 + textHeight);
    }
  }

  handleIconClick(event: MouseEvent) {
    const x = event.clientX - this.canvasContainer.nativeElement.getBoundingClientRect().left;
    const y = event.clientY - this.canvasContainer.nativeElement.getBoundingClientRect().top;
  
    for (const icon of this.icons) {
      const textWidth = this.ctx!.measureText(icon.name).width;
      const textHeight = 14;
      const iconWidth = textWidth + 20; // Add padding
      const iconHeight = textHeight + 20; // Add padding
  
      if (x >= icon.x && x <= icon.x + iconWidth && y >= icon.y && y <= icon.y + iconHeight) {
        if (this.selectedIcon === null) {
          // Select the current icon
          this.selectedIcon = { x: icon.x + iconWidth, y: icon.y + iconHeight / 2, message: icon.name };
        } else if (this.selectedIcon.message !== icon.name) {
          // If a different icon is clicked, establish a link
          this.drawArrowLine(this.selectedIcon, { x: icon.x, y: icon.y + iconHeight / 2 });
          console.log(`Link established from (${this.selectedIcon.message}) ${this.selectedIcon.x},${this.selectedIcon.y} to (${icon.name}) ${icon.x},${icon.y}`);
          this.selectedIcon = null;
        } else {
          // Deselect the current icon if it's the same as the selected icon
          this.selectedIcon = null;
        }
        break;
      }
    }
  }
   
  

  drawArrowLine(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (!this.ctx) return;

    this.ctx.strokeStyle = 'green';
    this.ctx.lineWidth = 2;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);

    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();

    // Draw arrowhead
    this.ctx.fillStyle = 'green';
    this.ctx.beginPath();
    this.ctx.lineTo(end.x - 10 * Math.cos(angle - Math.PI / 6), end.y - 10 * Math.sin(angle - Math.PI / 6));
    this.ctx.lineTo(end.x, end.y);
    this.ctx.lineTo(end.x - 10 * Math.cos(angle + Math.PI / 6), end.y - 10 * Math.sin(angle + Math.PI / 6));
    this.ctx.closePath();
    this.ctx.fill();
  }
}
