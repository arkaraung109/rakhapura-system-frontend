import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnonymousRoutingModule } from './anonymous-routing.module';
import { PublicexamresultComponent } from './publicexamresult/publicexamresult.component';
import { AnonymousComponent } from './anonymous.component';


@NgModule({
  declarations: [
    PublicexamresultComponent,
    AnonymousComponent
  ],
  imports: [
    CommonModule,
    AnonymousRoutingModule
  ]
})
export class AnonymousModule { }
