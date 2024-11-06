import { inject, Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { IUser, UserModel } from '@t-talk/shared';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly fireAuth: Auth = inject(Auth);
  private readonly fireStore: Firestore = inject(Firestore);
  private readonly user$ = user(this.fireAuth);

  public getUserData(): Observable<UserModel | null> {
    return this.user$.pipe(
      switchMap((user) => {
        const userRef = doc(this.fireStore, `users/${user?.uid}`);

        return from(getDoc(userRef)).pipe(
          map(
            (docSnapshot) =>
              new UserModel({
                uid: user?.uid,
                ...docSnapshot.data(),
              } as IUser),
          ),
        );
      }),
    );
  }
}
