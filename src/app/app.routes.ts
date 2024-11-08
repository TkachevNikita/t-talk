import type { Route } from '@angular/router';

import { canActivateAuthRouteGuard } from '../../libs/auth/src/lib/auth/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'auth',
        loadChildren: async () =>
          import('@t-talk/auth').then((m) => m.authRoutes),
      },
      {
        path: 'profile',
        canActivate: [canActivateAuthRouteGuard],
        loadChildren: async () =>
          import('@t-talk/profile').then((m) => m.profileRoutes),
      },
    ],
  },
];
