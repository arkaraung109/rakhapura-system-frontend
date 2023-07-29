import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentExamRoutingModule } from './student-exam-routing.module';
import { StudentExamComponent } from './student-exam.component';
import { StudentExamCreateComponent } from './student-exam-create/student-exam-create.component';
import { StudentExamListComponent } from './student-exam-list/student-exam-list.component';
import { StudentExamEditComponent } from './student-exam-edit/student-exam-edit.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { StudentExamDetailComponent } from './student-exam-detail/student-exam-detail.component';


@NgModule({
  declarations: [
    StudentExamComponent,
    StudentExamCreateComponent,
    StudentExamListComponent,
    StudentExamEditComponent,
    StudentExamDetailComponent
  ],
  imports: [
    CommonModule,
    StudentExamRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class StudentExamModule { }
