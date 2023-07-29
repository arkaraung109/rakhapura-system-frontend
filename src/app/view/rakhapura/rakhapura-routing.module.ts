import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicYearComponent } from './page/academic-year/academic-year.component';
import { ProfileComponent } from './page/profile/profile.component';
import { UserPermission } from 'src/app/common/UserPermission';
import { AuthGuard } from 'src/app/interceptor/auth.guard';
import { GradeComponent } from './page/grade/grade.component';
import { ExamTitleComponent } from './page/exam-title/exam-title.component';
import { ClassComponent } from './page/class/class.component';
import { RegionComponent } from './page/region/region.component';
import { HostelComponent } from './page/hostel/hostel.component';
import { StudentComponent } from './page/student/student.component';
import { SubjectTypeComponent } from './page/subject-type/subject-type.component';
import { ExamComponent } from './page/exam/exam.component';
import { SubjectComponent } from './page/subject/subject.component';
import { StudentClassComponent } from './page/student-class/student-class.component';
import { ExamSubjectComponent } from './page/exam-subject/exam-subject.component';
import { ArrivalComponent } from './page/arrival/arrival.component';
import { StudentCardComponent } from './page/student-card/student-card.component';
import { AttendanceComponent } from './page/attendance/attendance.component';
import { StudentHostelComponent } from './page/student-hostel/student-hostel.component';
import { StudentExamComponent } from './page/student-exam/student-exam.component';
import { StudentExamModerateComponent } from './page/student-exam-moderate/student-exam-moderate.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch : 'full'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY, UserPermission.STUDENT_ENTRY, UserPermission.HOSTEL_ATTENDANCE_ENTRY, UserPermission.ATTENDANCE_ENTRY, UserPermission.EXAM_MARK_ENTRY]
    }
  },
  {
    path: 'academic-year',
    component: AcademicYearComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/academic-year/academic-year.module').then(m => m.AcademicYearModule)
      },
    ]
  },
  {
    path: 'grade',
    component: GradeComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/grade/grade.module').then(m => m.GradeModule)
      },
    ]
  },
  {
    path: 'exam-title',
    component: ExamTitleComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/exam-title/exam-title.module').then(m => m.ExamTitleModule)
      },
    ]
  },
  {
    path: 'class',
    component: ClassComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/class/class.module').then(m => m.ClassModule)
      },
    ]
  },
  {
    path: 'region',
    component: RegionComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/region/region.module').then(m => m.RegionModule)
      },
    ]
  },
  {
    path: 'hostel',
    component: HostelComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/hostel/hostel.module').then(m => m.HostelModule)
      },
    ]
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.STUDENT_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/student/student.module').then(m => m.StudentModule)
      },
    ]
  },
  {
    path: 'student-class',
    component: StudentClassComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.STUDENT_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/student-class/student-class.module').then(m => m.StudentClassModule)
      },
    ]
  },
  {
    path: 'subject-type',
    component: SubjectTypeComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/subject-type/subject-type.module').then(m => m.SubjectTypeModule)
      },
    ]
  },
  {
    path: 'exam',
    component: ExamComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/exam/exam.module').then(m => m.ExamModule)
      },
    ]
  },
  {
    path: 'subject',
    component: SubjectComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/subject/subject.module').then(m => m.SubjectModule)
      },
    ]
  },
  {
    path: 'exam-subject',
    component: ExamSubjectComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/exam-subject/exam-subject.module').then(m => m.ExamSubjectModule)
      },
    ]
  },
  {
    path: 'arrival',
    component: ArrivalComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.STUDENT_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/arrival/arrival.module').then(m => m.ArrivalModule)
      },
    ]
  },
  {
    path: 'student-card',
    component: StudentCardComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.EXAM_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/student-card/student-card.module').then(m => m.StudentCardModule)
      },
    ]
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.ATTENDANCE_ENTRY, UserPermission.EXAM_MARK_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/attendance/attendance.module').then(m => m.AttendanceModule)
      },
    ]
  },
  {
    path: 'student-hostel',
    component: StudentHostelComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.HOSTEL_ATTENDANCE_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/student-hostel/student-hostel.module').then(m => m.StudentHostelModule)
      },
    ]
  },
  {
    path: 'student-exam',
    component: StudentExamComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_MARK_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/student-exam/student-exam.module').then(m => m.StudentExamModule)
      },
    ]
  },
  {
    path: 'student-exam-moderate',
    component: StudentExamModerateComponent,
    canActivateChild: [AuthGuard],
    data: {
      allowedRoles: [UserPermission.ADMIN, UserPermission.EXAM_MARK_ENTRY]
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./page/student-exam-moderate/student-exam-moderate.module').then(m => m.StudentExamModerateModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RakhapuraRoutingModule { }
