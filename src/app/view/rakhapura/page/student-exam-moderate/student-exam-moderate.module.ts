import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentExamModerateRoutingModule } from './student-exam-moderate-routing.module';
import { StudentExamModerateComponent } from './student-exam-moderate.component';
import { StudentExamModerateListComponent } from './student-exam-moderate-list/student-exam-moderate-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    StudentExamModerateComponent,
    StudentExamModerateListComponent
  ],
  imports: [
    CommonModule,
    StudentExamModerateRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class StudentExamModerateModule { }
