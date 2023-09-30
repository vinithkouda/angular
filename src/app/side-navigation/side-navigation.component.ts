import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
  standalone: true,
  imports: [NgIf, MatSidenavModule],
})
export class SideNavigationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  dragStart(event: DragEvent, shape: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', shape);
    }
  }
  // shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);

}
