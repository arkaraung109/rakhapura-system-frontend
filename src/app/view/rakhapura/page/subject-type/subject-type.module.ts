import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectTypeRoutingModule } from './subject-type-routing.module';
import { SubjectTypeComponent } from './subject-type.component';
import { SubjectTypeCreateComponent } from './subject-type-create/subject-type-create.component';
import { SubjectTypeListComponent } from './subject-type-list/subject-type-list.component';
import { SubjectTypeEditComponent } from './subject-type-edit/subject-type-edit.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    SubjectTypeComponent,
    SubjectTypeCreateComponent,
    SubjectTypeListComponent,
    SubjectTypeEditComponent
  ],
  imports: [
    CommonModule,
    SubjectTypeRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class SubjectTypeModule { }
