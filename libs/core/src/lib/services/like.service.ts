import { inject, Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  runTransaction,
  where,
} from '@angular/fire/firestore';
import { ILike, IPost } from '@t-talk/shared';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable()
export class LikeService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly likesCollection = collection(this.firestore, 'likes');

  public setLike(postId: string, userId: string): Observable<void> {
    const id = crypto.randomUUID();
    const postRef = doc(this.firestore, `posts/${postId}`);
    const likeRef = doc(this.firestore, `likes/${id}`);

    return from(
      runTransaction(this.firestore, async (transaction) => {
        const postSnapshot = await transaction.get(postRef);

        const postData = postSnapshot.data() as IPost;
        const likesCount = (postData.likesCount || 0) + 1;

        transaction.set(likeRef, { postId, userId, id } as ILike);
        transaction.update(postRef, { likesCount });
      }),
    );
  }

  public removeLike(postId: string, userId: string): Observable<void> {
    const likeQuery = query(
      this.likesCollection,
      where('postId', '==', postId),
      where('userId', '==', userId),
    );

    return from(
      runTransaction(this.firestore, async (transaction) => {
        const likeSnapshot = await getDocs(likeQuery);

        if (!likeSnapshot.empty) {
          const likeDoc = likeSnapshot.docs[0];
          const postRef = doc(this.firestore, `posts/${postId}`);
          const postSnapshot = await transaction.get(postRef);

          const postData = postSnapshot.data() as IPost;
          const likesCount = (postData.likesCount || 0) - 1;

          transaction.delete(likeDoc.ref);
          transaction.update(postRef, { likesCount });
        }
      }),
    );
  }

  public isLikeByUser(postId: string, userId: string): Observable<boolean> {
    const likeQuery = query(
      this.likesCollection,
      where('postId', '==', postId),
      where('userId', '==', userId),
    );

    return from(getDocs(likeQuery)).pipe(map((snapshot) => !snapshot.empty));
  }

  public deleteLikesByPostId(postId: string): Observable<void[]> {
    const likesQuery = query(
      this.likesCollection,
      where('postId', '==', postId),
    );

    return from(getDocs(likesQuery)).pipe(
      switchMap((snapshot) =>
        from(Promise.all(snapshot.docs.map(async (doc) => deleteDoc(doc.ref)))),
      ),
    );
  }
}
