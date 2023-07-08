import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradeCreateComponent } from './grade-create/grade-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { GradeListComponent } from './grade-list/grade-list.component';
import { GradeEditComponent } from './grade-edit/grade-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: GradeCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.EXAM_ENTRY]
    }
  },
  {
    path: 'list',
    component: GradeListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    }
  },
  {
    path: 'edit',
    component: GradeEditComponent,
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
export class GradeRoutingModule { }
