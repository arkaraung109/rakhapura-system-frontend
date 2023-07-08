import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArrivalRoutingModule } from './arrival-routing.module';
import { ArrivalComponent } from './arrival.component';
import { ArrivalCreateComponent } from './arrival-create/arrival-create.component';
import { ArrivalListComponent } from './arrival-list/arrival-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    ArrivalComponent,
    ArrivalCreateComponent,
    ArrivalListComponent
  ],
  imports: [
    CommonModule,
    ArrivalRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class ArrivalModule { }
