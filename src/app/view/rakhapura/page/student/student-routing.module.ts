import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentCreateComponent } from './student-create/student-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: StudentCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.STUDENT_ENTRY]
    }
  },
  {
    path: 'list',
    component: StudentListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.STUDENT_ENTRY]
    }
  },
  {
    path: 'edit',
    component: StudentEditComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.STUDENT_ENTRY]
    }
  },
  {
    path: 'detail',
    component: StudentDetailComponent,
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
export class StudentRoutingModule { }
