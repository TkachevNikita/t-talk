import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { UserService } from '@t-talk/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<string | null> {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  public resolve(): Observable<string | null> {
    return this.userService.currentUser.pipe(
      map((user) => {
        if (user?.uid) {
          return user.uid;
        }

        this.router.navigate(['/auth']);

        return null;
      }),
    );
  }
}
