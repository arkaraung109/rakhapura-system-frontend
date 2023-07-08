import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegionRoutingModule } from './region-routing.module';
import { RegionComponent } from './region.component';
import { RegionCreateComponent } from './region-create/region-create.component';
import { RegionEditComponent } from './region-edit/region-edit.component';
import { RegionListComponent } from './region-list/region-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    RegionComponent,
    RegionCreateComponent,
    RegionEditComponent,
    RegionListComponent
  ],
  imports: [
    CommonModule,
    RegionRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class RegionModule { }
