import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnonymousRoutingModule } from './anonymous-routing.module';
import { AnonymousComponent } from './anonymous.component';
import { HomeComponent } from './home/home.component';
import { PublicExamResultComponent } from './public-exam-result/public-exam-result.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '../share/share.module';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    AnonymousComponent,
    HomeComponent,
    PublicExamResultComponent
  ],
  imports: [
    CommonModule,
    AnonymousRoutingModule,
    HttpClientModule,
    FormsModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class AnonymousModule { }
