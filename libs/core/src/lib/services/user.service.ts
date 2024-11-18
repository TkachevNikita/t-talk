import { inject, Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
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

  private readonly usersLoading$: BehaviorSubject<boolean> =
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

  public get isUsersListLoading(): Observable<boolean> {
    return this.usersLoading$.asObservable();
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

    this.usersLoading$.next(true);

    return this.user$.pipe(
      switchMap((currentUser) =>
        from(getDocs(usersRef)).pipe(
          map((querySnapshot) =>
            querySnapshot.docs
              .map(
                (doc) => new UserModel({ uid: doc.id, ...doc.data() } as IUser),
              )
              .filter((user) => user.uid !== currentUser?.uid)
              .filter((user: UserModel) => {
                if (!searchTerm) {
                  return true;
                }

                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                const fullName =
                  `${user.firstName} ${user.secondName}`.toLowerCase();

                return fullName.includes(lowerCaseSearchTerm);
              }),
          ),
          finalize(() => {
            this.usersLoading$.next(false);
          }),
        ),
      ),
    );
  }

  public isCurrentUserProfile(profileId: string): Observable<boolean> {
    return this.currentUser.pipe(
      map((currentUser) => currentUser?.uid === profileId),
    );
  }

  public updateUser(
    userId: string,
    userData: Partial<IUser>,
  ): Observable<void> {
    this.isUserLoading$.next(true);
    const userRef = doc(this.fireStore, `users/${userId}`);

    return from(updateDoc(userRef, userData)).pipe(
      finalize(() => {
        this.userSubject$.next();
        this.isUserLoading$.next(false);
      }),
    );
  }

  public updateUserProfilePicture(
    userId: string,
    file: File,
  ): Observable<void> {
    this.isUserLoading$.next(true);
    const storage = getStorage();
    const folderRef = ref(storage, `profilePictures/${userId}`);
    const fileRef = ref(storage, `profilePictures/${userId}/${file.name}`);

    return from(listAll(folderRef)).pipe(
      switchMap((listResult) =>
        from(
          Promise.all(listResult.items.map(async (item) => deleteObject(item))),
        ),
      ),
      switchMap(() => from(uploadBytes(fileRef, file))),
      switchMap(() => from(getDownloadURL(fileRef))),
      switchMap((downloadUrl) =>
        this.updateUser(userId, { profilePictureId: downloadUrl }),
      ),
      finalize(() => {
        this.isUserLoading$.next(false);
        this.userSubject$.next();
      }),
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
