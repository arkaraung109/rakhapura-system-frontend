import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentCardRoutingModule } from './student-card-routing.module';
import { StudentCardComponent } from './student-card.component';
import { StudentCardCreateComponent } from './student-card-create/student-card-create.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    StudentCardComponent,
    StudentCardCreateComponent
  ],
  imports: [
    CommonModule,
    StudentCardRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class StudentCardModule { }
