import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuService } from './service/menu.service';
import { AuthModule } from './view/auth/auth.module';
import { ErrorComponent } from './view/error/error.component';
import { RakhapuraModule } from './view/rakhapura/rakhapura.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { SaveAnotherDialogComponent } from './save-another-dialog/save-another-dialog.component';
import { AnonymousModule } from './view/anonymous/anonymous.module';

@NgModule({
  declarations: [AppComponent, ErrorComponent, ConfirmDialogComponent, SaveAnotherDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    AnonymousModule,
    RakhapuraModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule,
    MatSortModule,
    BrowserAnimationsModule, //toastr required animations module
    ToastrModule.forRoot({
      /*ref : https://www.npmjs.com/package/ngx-toastr*/
      timeOut: 4000,
      newestOnTop: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
    })
  ],
  providers: [
    MenuService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
