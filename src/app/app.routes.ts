import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
      },
      {
        path: 'auth',
        loadChildren: async () =>
          import('@t-talk/auth').then((m) => m.authRoutes),
      },
      {
        path: 'profile',
        loadChildren: async () =>
          import('@t-talk/profile').then((m) => m.profileRoutes),
      },
    ],
  },
];
