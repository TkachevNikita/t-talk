import type { Route } from '@angular/router';
import { ProfileComponent } from '@t-talk/profile';

export const profileRoutes: Route[] = [
  {
    path: '',
    component: ProfileComponent,
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
