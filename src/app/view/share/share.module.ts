import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNavigatorComponent } from './page-navigator/page-navigator.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PageNavigatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    PageNavigatorComponent,
    FormsModule
  ]
})
export class ShareModule { }
