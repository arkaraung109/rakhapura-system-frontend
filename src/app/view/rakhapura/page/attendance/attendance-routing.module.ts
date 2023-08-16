import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceCreateComponent } from './attendance-create/attendance-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { AttendanceDetailComponent } from './attendance-detail/attendance-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: AttendanceCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ATTENDANCE_ENTRY]
    }
  },
  {
    path: 'list',
    component: AttendanceListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.ATTENDANCE_ENTRY, UserPermission.EXAM_MARK_ENTRY]
    }
  },
  {
    path: 'detail',
    component: AttendanceDetailComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_MARK_ENTRY]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
