import type { Route } from '@angular/router';
import { ProfileComponent } from '@t-talk/profile';

import { UserResolver } from '../../../../core/src/lib/resolvers/user.resolver';

export const profileRoutes: Route[] = [
  {
    path: '',
    component: ProfileComponent,
    resolve: {
      userId: UserResolver,
    },
    children: [
      {
        path: ':id',
        loadComponent: async () =>
          import(
            './components/profile-overview/profile-overview.component'
          ).then((m) => m.ProfileOverviewComponent),
      },
    ],
  },
];
