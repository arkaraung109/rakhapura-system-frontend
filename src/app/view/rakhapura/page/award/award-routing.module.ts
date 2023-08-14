import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AwardCreateComponent } from './award-create/award-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { AwardListComponent } from './award-list/award-list.component';
import { AwardEditComponent } from './award-edit/award-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: AwardCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.EXAM_ENTRY]
    }
  },
  {
    path: 'list',
    component: AwardListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    }
  },
  {
    path: 'edit',
    component: AwardEditComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.EXAM_ENTRY]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AwardRoutingModule { }
