import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamTitleRoutingModule } from './exam-title-routing.module';
import { ExamTitleCreateComponent } from './exam-title-create/exam-title-create.component';
import { ExamTitleEditComponent } from './exam-title-edit/exam-title-edit.component';
import { ExamTitleListComponent } from './exam-title-list/exam-title-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ExamTitleComponent } from './exam-title.component';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    ExamTitleComponent,
    ExamTitleCreateComponent,
    ExamTitleEditComponent,
    ExamTitleListComponent
  ],
  imports: [
    CommonModule,
    ExamTitleRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class ExamTitleModule { }
