import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateComponent } from './certificate.component';
import { CertificateCreateComponent } from './certificate-create/certificate-create.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CertificateComponent,
    CertificateCreateComponent
  ],
  imports: [
    CommonModule,
    CertificateRoutingModule,
    ReactiveFormsModule
  ]
})
export class CertificateModule { }
