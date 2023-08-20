import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'detail',
    pathMatch: 'full'
  },
  {
    path: 'detail',
    component: ProfileDetailComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ANONYMOUS]
    }
  },
  {
    path: 'edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ANONYMOUS]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
