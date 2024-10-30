import type { Route } from '@angular/router';
import { AuthComponent } from '@t-talk/auth';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: async () =>
          import('./components/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: async () =>
          import('./components/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
    ],
  },
];
