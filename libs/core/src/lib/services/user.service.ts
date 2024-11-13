import { inject, Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { IUser, UserModel } from '@t-talk/shared';
import {
  BehaviorSubject,
  filter,
  finalize,
  from,
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  switchMap,
  take,
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

  private readonly userSubject$: ReplaySubject<void> = new ReplaySubject<void>(
    1,
  );

  constructor() {
    this.userSubject$.next();
  }

  public get currentUser(): Observable<UserModel> {
    return this.userSubject$.pipe(
      take(1),
      switchMap(() => this.getUserData()),
      shareReplay({ bufferSize: 1, refCount: false }),
      filter(Boolean),
    );
  }

  public get isUserLoading(): Observable<boolean> {
    return this.isUserLoading$.asObservable();
  }

  public getUserById(userId: string): Observable<UserModel | null> {
    const userRef = doc(this.fireStore, `users/${userId}`);

    return from(getDoc(userRef)).pipe(
      map((docSnapshot) =>
        docSnapshot.exists()
          ? new UserModel({ uid: userId, ...docSnapshot.data() } as IUser)
          : null,
      ),
    );
  }

  public getAllUsers(searchTerm?: string): Observable<UserModel[]> {
    const usersRef = collection(this.fireStore, 'users');

    return this.user$.pipe(
      switchMap((currentUser) => {
        const usersQuery = searchTerm
          ? query(
              usersRef,
              where('firstName', '>=', searchTerm),
              where('firstName', '<=', `${searchTerm}\uF8FF`),
            )
          : usersRef;

        return from(getDocs(usersQuery)).pipe(
          map((querySnapshot) =>
            querySnapshot.docs
              .map(
                (doc) => new UserModel({ uid: doc.id, ...doc.data() } as IUser),
              )
              .filter((user) => user.uid !== currentUser?.uid),
          ),
        );
      }),
    );
  }

  public isCurrentUserProfile(profileId: string): Observable<boolean> {
    return this.currentUser.pipe(
      map((currentUser) => currentUser?.uid === profileId),
    );
  }

  private getUserData(): Observable<UserModel | null> {
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
                } as IUser)
              : null,
          ),
          finalize(() => {
            this.isUserLoading$.next(false);
            this.userSubject$.next();
          }),
        );
      }),
    );
  }
}
