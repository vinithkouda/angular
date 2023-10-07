import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BpmnDiagramsService, ComplexHierarchicalTreeService, ConnectorBridgingService, ConnectorEditingService, DataBindingService, DiagramContextMenuService, DiagramModule, HierarchicalTreeService, LayoutAnimationService, MindMapService, PrintAndExportService, RadialTreeService, SnappingService, SymmetricLayoutService, UndoRedoService } from '@syncfusion/ej2-angular-diagrams';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NHaF5cXmVCf1JpQXxbf1xzZFREalhZTnRZUj0eQnxTdEZiWX9bcXZRTmJbU0d2XA==');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SideNavigationComponent,
    DiagramModule
  ],
  providers: [HierarchicalTreeService, MindMapService, RadialTreeService, ComplexHierarchicalTreeService, DataBindingService, SnappingService, PrintAndExportService, BpmnDiagramsService, SymmetricLayoutService, ConnectorBridgingService, UndoRedoService, LayoutAnimationService, DiagramContextMenuService, ConnectorEditingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
