import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArrivalCreateComponent } from './arrival-create/arrival-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { ArrivalListComponent } from './arrival-list/arrival-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: ArrivalCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.STUDENT_ENTRY]
    }
  },
  {
    path: 'list',
    component: ArrivalListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.STUDENT_ENTRY]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArrivalRoutingModule { }
