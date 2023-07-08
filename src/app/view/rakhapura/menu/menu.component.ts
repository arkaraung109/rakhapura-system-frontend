import { Component, Input, Renderer2, ViewChild } from '@angular/core';
import { MenuItem } from 'src/app/model/MenuItem';
import { Menu } from '../../../model/Menu';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  @Input('menu') menu!: Menu;
  @ViewChild('menuContent') menuContentElement: any;
  contentDisplay: boolean = false;
  menuItems: MenuItem[] = [];

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.menuItems = [...this.menu.items];
  }

  toggleMenuCategory() {
    if(this.contentDisplay == true) {
      this.contentDisplay = false;
    } else {
      this.contentDisplay = true;
    }

    let cssDisplayValue = 'none';

    if(this.contentDisplay) {
      cssDisplayValue = 'block';
    }

    this.renderer.setStyle(
      this.menuContentElement.nativeElement,
      'display',
      cssDisplayValue
    );
  }
  
}
