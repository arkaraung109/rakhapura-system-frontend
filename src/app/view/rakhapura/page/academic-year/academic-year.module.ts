import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicYearRoutingModule } from './academic-year-routing.module';
import { AcademicYearComponent } from './academic-year.component';
import { AcademicYearListComponent } from './academic-year-list/academic-year-list.component';
import { AcademicYearCreateComponent } from './academic-year-create/academic-year-create.component';
import { AcademicYearEditComponent } from './academic-year-edit/academic-year-edit.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    AcademicYearComponent,
    AcademicYearListComponent,
    AcademicYearCreateComponent,
    AcademicYearEditComponent
  ],
  imports: [
    CommonModule,
    AcademicYearRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class AcademicYearModule { }
