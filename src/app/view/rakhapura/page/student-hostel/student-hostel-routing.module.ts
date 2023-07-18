import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentHostelCreateComponent } from './student-hostel-create/student-hostel-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { StudentHostelListComponent } from './student-hostel-list/student-hostel-list.component';
import { StudentHostelEditComponent } from './student-hostel-edit/student-hostel-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: StudentHostelCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.HOSTEL_ATTENDANCE_ENTRY]
    }
  },
  {
    path: 'list',
    component: StudentHostelListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.HOSTEL_ATTENDANCE_ENTRY]
    }
  },
  {
    path: 'edit',
    component: StudentHostelEditComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.HOSTEL_ATTENDANCE_ENTRY]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentHostelRoutingModule { }
