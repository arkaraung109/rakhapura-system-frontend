import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostelRoutingModule } from './hostel-routing.module';
import { HostelComponent } from './hostel.component';
import { HostelCreateComponent } from './hostel-create/hostel-create.component';
import { HostelEditComponent } from './hostel-edit/hostel-edit.component';
import { HostelListComponent } from './hostel-list/hostel-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    HostelComponent,
    HostelCreateComponent,
    HostelEditComponent,
    HostelListComponent
  ],
  imports: [
    CommonModule,
    HostelRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class HostelModule { }
