import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MenuService } from 'src/app/service/menu.service';
import { Menu } from '../../../model/Menu';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, AfterViewInit {
  
  @ViewChild("sidenav") sideNavElement: any;
  menulist!:Menu[];

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2, 
    private menuService: MenuService, 
    private router: Router, 
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.menulist = [...this.menuService.fetchMenuList()];
  }

  ngAfterViewInit(): void {
    const requiredStyles: any = {
      'min-height': 'calc(100vh)',
      'width': '100%'
    };

    Object.keys(requiredStyles).forEach(newStyle => {
      let styleVal: string = requiredStyles[newStyle];
      this.renderer.setStyle(
        this.sideNavElement.nativeElement,
        `${newStyle}`, 
        styleVal
      );
    });
  }

  openNav() {
    const requiredStyles: any = {
      'min-height': 'calc(100vh)',
      'width': '100%'
    };

    Object.keys(requiredStyles).forEach(newStyle => {
      let styleVal: string = requiredStyles[newStyle];
      this.renderer.setStyle(
        this.sideNavElement.nativeElement,
        `${newStyle}`, 
        styleVal
      );
    });

    this.renderer.setStyle(
      this.elRef.nativeElement.parentElement,
      'height',
      '100%'
    );
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const requiredStyles: any = {
      'min-height': 'calc(100vh)',
      'width': '100%'
    };
    Object.keys(requiredStyles).forEach(newStyle => {
      let styleVal: string = requiredStyles[newStyle];
      this.renderer.setStyle(
        this.sideNavElement.nativeElement,
        `${newStyle}`, 
        styleVal
      );
    });
    this.renderer.setStyle(
      this.elRef.nativeElement.parentElement,
      'height',
      '100%'
    );
  }

  closeNav() {
    if(window.innerWidth > 989) {
      this.renderer.setStyle(
        this.sideNavElement.nativeElement,
        'width',
        '0px'
      );
      this.renderer.setStyle(
        this.elRef.nativeElement.parentElement,
        'height',
        '100%'
      );
    } else {
      this.renderer.setStyle(
        this.sideNavElement.nativeElement,
        'width',
        '0px'
      );
      this.renderer.setStyle(
        this.elRef.nativeElement.parentElement,
        'height',
        '30%'
      );
    }
  }

  logout() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        localStorage.clear();
        this.router.navigate(['auth']);
      } else {
        this.matDialog.closeAll();
      }
    });
  }
  
}
