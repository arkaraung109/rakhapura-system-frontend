import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentExamCreateComponent } from './student-exam-create/student-exam-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { StudentExamListComponent } from './student-exam-list/student-exam-list.component';
import { StudentExamEditComponent } from './student-exam-edit/student-exam-edit.component';
import { StudentExamDetailComponent } from './student-exam-detail/student-exam-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: StudentExamCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.EXAM_MARK_ENTRY]
    }
  },
  {
    path: 'list',
    component: StudentExamListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_MARK_ENTRY]
    }
  },
  {
    path: 'edit',
    component: StudentExamEditComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.EXAM_MARK_ENTRY]
    }
  },
  {
    path: 'detail',
    component: StudentExamDetailComponent,
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
export class StudentExamRoutingModule { }
