import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentCardCreateComponent } from './student-card-create/student-card-create.component';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { UserPermission } from 'src/app/common/UserPermission';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: StudentCardCreateComponent,
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
export class StudentCardRoutingModule { }
