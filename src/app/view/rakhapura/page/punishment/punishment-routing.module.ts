import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PunishmentCreateComponent } from './punishment-create/punishment-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { PunishmentListComponent } from './punishment-list/punishment-list.component';
import { PunishmentEditComponent } from './punishment-edit/punishment-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: PunishmentCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.EXAM_ENTRY]
    }
  },
  {
    path: 'list',
    component: PunishmentListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    }
  },
  {
    path: 'edit',
    component: PunishmentEditComponent,
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
export class PunishmentRoutingModule { }
