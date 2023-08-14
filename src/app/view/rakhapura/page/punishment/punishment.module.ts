import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PunishmentRoutingModule } from './punishment-routing.module';
import { PunishmentComponent } from './punishment.component';
import { PunishmentCreateComponent } from './punishment-create/punishment-create.component';
import { PunishmentEditComponent } from './punishment-edit/punishment-edit.component';
import { PunishmentListComponent } from './punishment-list/punishment-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    PunishmentComponent,
    PunishmentCreateComponent,
    PunishmentEditComponent,
    PunishmentListComponent
  ],
  imports: [
    CommonModule,
    PunishmentRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class PunishmentModule { }
