import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import { ExamComponent } from './exam.component';
import { ExamCreateComponent } from './exam-create/exam-create.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamEditComponent } from './exam-edit/exam-edit.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    ExamComponent,
    ExamCreateComponent,
    ExamListComponent,
    ExamEditComponent
  ],
  imports: [
    CommonModule,
    ExamRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class ExamModule { }
