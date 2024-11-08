import { inject, Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { IUser, UserModel } from '@t-talk/shared';
import {
  BehaviorSubject,
  finalize,
  from,
  map,
  Observable,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly fireAuth: Auth = inject(Auth);
  private readonly fireStore: Firestore = inject(Firestore);
  private readonly user$ = user(this.fireAuth);
  private readonly isUserLoading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public get isUserLoading(): Observable<boolean> {
    return this.isUserLoading$.asObservable();
  }

  public getUserData(): Observable<UserModel | null> {
    this.isUserLoading$.next(true);

    return this.user$.pipe(
      switchMap((user) => {
        const userRef = doc(this.fireStore, `users/${user?.uid}`);

        return from(getDoc(userRef)).pipe(
          map((docSnapshot) =>
            docSnapshot.exists()
              ? new UserModel({
                  uid: user?.uid,
                  ...docSnapshot.data(),
                  birthDate: docSnapshot.data()['birthDate'].toDate(),
                } as IUser)
              : null,
          ),
          finalize(() => {
            this.isUserLoading$.next(false);
          }),
        );
      }),
    );
  }

  public getUserById(userId: string): Observable<UserModel | null> {
    const userRef = doc(this.fireStore, `users/${userId}`);

    this.isUserLoading$.next(true);

    return from(getDoc(userRef)).pipe(
      map((docSnapshot) =>
        docSnapshot.exists()
          ? new UserModel({ uid: userId, ...docSnapshot.data() } as IUser)
          : null,
      ),
      finalize(() => this.isUserLoading$.next(false)),
    );
  }

  public isCurrentUserProfile(profileId: string): Observable<boolean> {
    return this.getUserData().pipe(
      map((currentUser) => currentUser?.uid === profileId),
    );
  }
}
