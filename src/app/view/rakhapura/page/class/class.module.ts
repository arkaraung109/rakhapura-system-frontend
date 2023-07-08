import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassRoutingModule } from './class-routing.module';
import { ClassComponent } from './class.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClassCreateComponent } from './class-create/class-create.component';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassEditComponent } from './class-edit/class-edit.component';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    ClassComponent,
    ClassCreateComponent,
    ClassListComponent,
    ClassEditComponent
  ],
  imports: [
    CommonModule,
    ClassRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class ClassModule { }
