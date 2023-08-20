import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RakhapuraRoutingModule } from './rakhapura-routing.module';
import { MenuComponent } from './menu/menu.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HeaderComponent } from './header/header.component';
import { RakhapuraComponent } from './rakhapura.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AcademicYearModule } from './page/academic-year/academic-year.module';
import { ShareModule } from '../share/share.module';
import { GradeModule } from './page/grade/grade.module';
import { ExamTitleModule } from './page/exam-title/exam-title.module';
import { ClassModule } from './page/class/class.module';
import { RegionModule } from './page/region/region.module';
import { HostelModule } from './page/hostel/hostel.module';
import { StudentModule } from './page/student/student.module';
import { SubjectTypeModule } from './page/subject-type/subject-type.module';
import { ExamModule } from './page/exam/exam.module';
import { SubjectModule } from './page/subject/subject.module';
import { StudentClassModule } from './page/student-class/student-class.module';
import { ExamSubjectModule } from './page/exam-subject/exam-subject.module';
import { ArrivalModule } from './page/arrival/arrival.module';
import { StudentCardModule } from './page/student-card/student-card.module';
import { AttendanceModule } from './page/attendance/attendance.module';
import { StudentHostelModule } from './page/student-hostel/student-hostel.module';
import { StudentExamModule } from './page/student-exam/student-exam.module';
import { StudentExamModerateModule } from './page/student-exam-moderate/student-exam-moderate.module';
import { CertificateModule } from './page/certificate/certificate.module';
import { AwardModule } from './page/award/award.module';
import { PunishmentModule } from './page/punishment/punishment.module';
import { ProfileModule } from './page/profile/profile.module';
import { AppUserModule } from './page/app-user/app-user.module';

@NgModule({
  declarations: [
    MenuComponent,
    SideBarComponent,
    HeaderComponent,
    RakhapuraComponent,
  ],
  imports: [
    CommonModule,
    RakhapuraRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModule,
    ProfileModule,
    AppUserModule,
    AcademicYearModule,
    GradeModule,
    ExamTitleModule,
    ClassModule,
    RegionModule,
    HostelModule,
    StudentModule,
    SubjectTypeModule,
    ExamModule,
    SubjectModule,
    StudentClassModule,
    ExamSubjectModule,
    ArrivalModule,
    StudentCardModule,
    AttendanceModule,
    StudentHostelModule,
    StudentExamModule,
    StudentExamModerateModule,
    CertificateModule,
    AwardModule,
    PunishmentModule
  ]
})
export class RakhapuraModule { }
