import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { AttendanceCreateComponent } from './attendance-create/attendance-create.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { AttendanceDetailComponent } from './attendance-detail/attendance-detail.component';


@NgModule({
  declarations: [
    AttendanceComponent,
    AttendanceCreateComponent,
    AttendanceListComponent,
    AttendanceDetailComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class AttendanceModule { }
