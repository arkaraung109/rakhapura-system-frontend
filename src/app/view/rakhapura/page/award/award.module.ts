import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AwardRoutingModule } from './award-routing.module';
import { AwardComponent } from './award.component';
import { AwardCreateComponent } from './award-create/award-create.component';
import { AwardEditComponent } from './award-edit/award-edit.component';
import { AwardListComponent } from './award-list/award-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    AwardComponent,
    AwardCreateComponent,
    AwardEditComponent,
    AwardListComponent
  ],
  imports: [
    CommonModule,
    AwardRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class AwardModule { }
