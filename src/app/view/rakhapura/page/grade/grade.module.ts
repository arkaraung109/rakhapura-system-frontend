import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeComponent } from './grade.component';
import { GradeCreateComponent } from './grade-create/grade-create.component';
import { GradeListComponent } from './grade-list/grade-list.component';
import { GradeEditComponent } from './grade-edit/grade-edit.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GradeRoutingModule } from './grade-routing.module';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
    GradeComponent,
    GradeCreateComponent,
    GradeListComponent,
    GradeEditComponent
  ],
  imports: [
    CommonModule,
    GradeRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class GradeModule { }
