import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassEditComponent } from './class-edit/class-edit.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassCreateComponent } from './class-create/class-create.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: ClassCreateComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.EXAM_ENTRY]
    }
  },
  {
    path: 'list',
    component: ClassListComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    }
  },
  {
    path: 'edit',
    component: ClassEditComponent,
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
export class ClassRoutingModule { }
