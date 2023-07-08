import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamSubjectRoutingModule } from './exam-subject-routing.module';
import { ExamSubjectComponent } from './exam-subject.component';
import { ExamSubjectCreateComponent } from './exam-subject-create/exam-subject-create.component';
import { ExamSubjectListComponent } from './exam-subject-list/exam-subject-list.component';
import { ExamSubjectEditComponent } from './exam-subject-edit/exam-subject-edit.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    ExamSubjectComponent,
    ExamSubjectCreateComponent,
    ExamSubjectListComponent,
    ExamSubjectEditComponent
  ],
  imports: [
    CommonModule,
    ExamSubjectRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class ExamSubjectModule { }
