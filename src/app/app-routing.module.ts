import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousComponent } from './view/anonymous/anonymous.component';
import { AuthComponent } from './view/auth/auth.component';
import { ErrorComponent } from './view/error/error.component';
import { RakhapuraComponent } from './view/rakhapura/rakhapura.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/signin',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./view/auth/auth.module').then(m => m.AuthModule)
      }      
    ]
  },
  {
    path: 'anonymous',
    component: AnonymousComponent,
    children: [
      {
        path: '',
        redirectTo: '/anonymous/home',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./view/anonymous/anonymous.module').then(m => m.AnonymousModule)
      }      
    ]
  },
  {
    path: 'app',
    component: RakhapuraComponent,
    children: [
      {
        path: '',
        redirectTo: '/app/profile/detail',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./view/rakhapura/rakhapura.module').then(m => m.RakhapuraModule)
      },
    ]
  },
  {
    path: 'error/:errorCode',
    component: ErrorComponent
  },
  {
    path: '**',
    redirectTo: `/anonymous/home`
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
