import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IUser } from '@t-talk/shared';
import { catchError, from, Observable, switchMap, tap } from 'rxjs';

import { IAuthService } from '../interfaces/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly fireAuth: Auth = inject(Auth);
  private readonly fireStore: Firestore = inject(Firestore);
  private readonly router: Router = inject(Router);

  public register(user: IUser): Observable<void> {
    return from(
      createUserWithEmailAndPassword(this.fireAuth, user.email, user.password),
    ).pipe(
      switchMap((userCred) => {
        const userRef = doc(this.fireStore, `users/${userCred.user.uid}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...newUser } = user;

        return from(
          setDoc(userRef, {
            ...newUser,
            profilePictureId:
              'https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/user-male-circle-blue-1024.png',
          }),
        );
      }),
      tap(async () => this.router.navigate(['/profile'])),
      catchError((error: unknown) => {
        console.error('Ошибка при регистрации');

        throw error;
      }),
    );
  }

  public logout(): Observable<void> {
    return from(signOut(this.fireAuth));
  }

  public login(email: string, password: string): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(this.fireAuth, email, password),
    ).pipe(
      tap(async (userCred) =>
        this.router.navigate([`/profile/${userCred.user.uid}`]),
      ),
    );
  }
}
