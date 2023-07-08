import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectRoutingModule } from './subject-routing.module';
import { SubjectComponent } from './subject.component';
import { SubjectCreateComponent } from './subject-create/subject-create.component';
import { SubjectEditComponent } from './subject-edit/subject-edit.component';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    SubjectComponent,
    SubjectCreateComponent,
    SubjectEditComponent,
    SubjectListComponent
  ],
  imports: [
    CommonModule,
    SubjectRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class SubjectModule { }
