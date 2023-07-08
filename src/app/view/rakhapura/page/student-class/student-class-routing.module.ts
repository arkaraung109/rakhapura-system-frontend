import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentClassCreateComponent } from './student-class-create/student-class-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { StudentClassListComponent } from './student-class-list/student-class-list.component';
import { StudentClassEditComponent } from './student-class-edit/student-class-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: StudentClassCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.STUDENT_ENTRY]
    }
  },
  {
    path: 'list',
    component: StudentClassListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.STUDENT_ENTRY]
    }
  },
  {
    path: 'edit',
    component: StudentClassEditComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.STUDENT_ENTRY]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentClassRoutingModule { }
