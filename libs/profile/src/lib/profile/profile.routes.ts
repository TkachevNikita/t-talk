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
        path: 'search',
        loadComponent: async () =>
          import('./components/profile-search/profile-search.component').then(
            (m) => m.ProfileSearchComponent,
          ),
      },
      {
        path: 'edit',
        loadComponent: async () =>
          import('./components/profile-edit/profile-edit.component').then(
            (m) => m.ProfileEditComponent,
          ),
      },
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
