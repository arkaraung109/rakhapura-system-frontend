import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppUserCreateComponent } from './app-user-create/app-user-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { AppUserListComponent } from './app-user-list/app-user-list.component';
import { AppUserEditComponent } from './app-user-edit/app-user-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: AppUserCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN]
    }
  },
  {
    path: 'list',
    component: AppUserListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN]
    }
  },
  {
    path: 'edit',
    component: AppUserEditComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppUserRoutingModule { }
