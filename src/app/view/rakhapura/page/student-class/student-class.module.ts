import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentClassRoutingModule } from './student-class-routing.module';
import { StudentClassComponent } from './student-class.component';
import { StudentClassListComponent } from './student-class-list/student-class-list.component';
import { StudentClassCreateComponent } from './student-class-create/student-class-create.component';
import { StudentClassEditComponent } from './student-class-edit/student-class-edit.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentClassComponent,
    StudentClassListComponent,
    StudentClassCreateComponent,
    StudentClassEditComponent
  ],
  imports: [
    CommonModule,
    StudentClassRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class StudentClassModule { }
