import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentHostelRoutingModule } from './student-hostel-routing.module';
import { StudentHostelComponent } from './student-hostel.component';
import { StudentHostelCreateComponent } from './student-hostel-create/student-hostel-create.component';
import { StudentHostelListComponent } from './student-hostel-list/student-hostel-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { StudentHostelEditComponent } from './student-hostel-edit/student-hostel-edit.component';


@NgModule({
  declarations: [
    StudentHostelComponent,
    StudentHostelCreateComponent,
    StudentHostelListComponent,
    StudentHostelEditComponent
  ],
  imports: [
    CommonModule,
    StudentHostelRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class StudentHostelModule { }
