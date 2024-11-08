import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { IPost, PostModel } from '@t-talk/shared';
import {
  BehaviorSubject,
  finalize,
  from,
  map,
  Observable,
  switchMap,
} from 'rxjs';

@Injectable()
export class PostService {
  private readonly fireStore: Firestore = inject(Firestore);
  private readonly postCollection = collection(this.fireStore, 'posts');
  private readonly isLoading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public get isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  public createPost(post: IPost): Observable<PostModel[]> {
    return from(addDoc(this.postCollection, post)).pipe(
      map((dockRef) => dockRef.id),
      switchMap(() => this.getPostsByUserId(post.authorId)),
    );
  }

  public getPostsByUserId(
    userId: string,
    limitCount = 10,
  ): Observable<PostModel[]> {
    this.isLoading$.next(true);

    const postsQuery = query(
      this.postCollection,
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    );

    return from(getDocs(postsQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map(
          (doc) => new PostModel({ postId: doc.id, ...doc.data() } as IPost),
        ),
      ),
      finalize(() => this.isLoading$.next(false)),
    );
  }
}
