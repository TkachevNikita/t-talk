import { inject, Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { UserService } from '@t-talk/core';
import { UserModel } from '@t-talk/shared';
import {
  filter,
  forkJoin,
  from,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FollowerService {
  private readonly fireStore: Firestore = inject(Firestore);
  private readonly userService: UserService = inject(UserService);

  public getFollowing(userId: string): Observable<UserModel[]> {
    const followingRef = collection(
      this.fireStore,
      'followers',
      userId,
      'following',
    );

    return from(getDocs(followingRef)).pipe(
      switchMap((snapshot) => {
        const followingIds = snapshot.docs.map((doc) => doc.id);

        return forkJoin(
          followingIds.map((id) =>
            this.userService.getUserById(id).pipe(filter(Boolean)),
          ),
        );
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  public getFollowers(userId: string): Observable<UserModel[]> {
    const followersRef = collection(
      this.fireStore,
      'followers',
      userId,
      'followers',
    );

    return from(getDocs(followersRef)).pipe(
      switchMap((snapshot) => {
        const followerIds = snapshot.docs.map((doc) => doc.id);

        return forkJoin(
          followerIds.map((id) =>
            this.userService.getUserById(id).pipe(filter(Boolean)),
          ),
        );
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  public followUser(
    currentUserId: string,
    targetUserId: string,
  ): Observable<void> {
    const followingRef = doc(
      this.fireStore,
      'followers',
      currentUserId,
      'following',
      targetUserId,
    );
    const followersRef = doc(
      this.fireStore,
      'followers',
      targetUserId,
      'followers',
      currentUserId,
    );

    return from(
      Promise.all([setDoc(followingRef, {}), setDoc(followersRef, {})]),
    ).pipe(map(() => {}));
  }

  public unfollowUser(
    currentUserId: string,
    targetUserId: string,
  ): Observable<void> {
    const followingRef = doc(
      this.fireStore,
      'followers',
      currentUserId,
      'following',
      targetUserId,
    );
    const followersRef = doc(
      this.fireStore,
      'followers',
      targetUserId,
      'followers',
      currentUserId,
    );

    return from(
      Promise.all([deleteDoc(followingRef), deleteDoc(followersRef)]),
    ).pipe(map(() => {}));
  }
}
