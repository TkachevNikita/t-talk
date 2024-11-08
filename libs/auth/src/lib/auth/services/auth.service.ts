import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { IUser } from '@t-talk/shared';
import { catchError, from, Observable, switchMap } from 'rxjs';

import { IAuthService } from '../interfaces/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly fireAuth: Auth = inject(Auth);
  private readonly fireStore: Firestore = inject(Firestore);

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
          }),
        );
      }),
      catchError((error: unknown) => {
        console.error('Ошибка при регистрации');

        throw error;
      }),
    );
  }

  public login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.fireAuth, email, password));
  }
}
