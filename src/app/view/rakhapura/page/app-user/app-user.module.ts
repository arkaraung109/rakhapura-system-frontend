import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppUserRoutingModule } from './app-user-routing.module';
import { AppUserComponent } from './app-user.component';
import { AppUserCreateComponent } from './app-user-create/app-user-create.component';
import { AppUserListComponent } from './app-user-list/app-user-list.component';
import { ShareModule } from 'src/app/view/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { AppUserEditComponent } from './app-user-edit/app-user-edit.component';


@NgModule({
  declarations: [
    AppUserComponent,
    AppUserCreateComponent,
    AppUserListComponent,
    AppUserEditComponent
  ],
  imports: [
    CommonModule,
    AppUserRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatSortModule
  ]
})
export class AppUserModule { }
