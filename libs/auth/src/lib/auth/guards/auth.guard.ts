import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import type { CanActivateFn, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

export const canActivateAuthRouteGuard: CanActivateFn = (): Observable<
  UrlTree | boolean
> => {
  const auth: Auth = inject(Auth);
  const router: Router = inject(Router);
  const user$ = user(auth);

  return user$.pipe(
    map((userData) => {
      if (userData) {
        return true;
      }

      return router.parseUrl('/auth');
    }),
  );
};
