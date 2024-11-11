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
  combineLatest,
  finalize,
  from,
  map,
  Observable,
  ReplaySubject,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Injectable()
export class PostService {
  private readonly fireStore: Firestore = inject(Firestore);
  private readonly postCollection = collection(this.fireStore, 'posts');
  private readonly isLoading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private readonly postSubject$: ReplaySubject<PostModel[]> = new ReplaySubject<
    PostModel[]
  >(1);

  public getPosts(userId: string): Observable<PostModel[]> {
    return combineLatest([
      this.postSubject$,
      this.getPostsFromStore(userId).pipe(take(1)),
    ]).pipe(
      map(([localPosts, serverPosts]) =>
        localPosts.length ? localPosts : serverPosts,
      ),
    );
  }

  public createPost(post: IPost): Observable<PostModel[]> {
    return from(addDoc(this.postCollection, post)).pipe(
      switchMap(() =>
        this.getPostsFromStore(post.authorId).pipe(
          tap((posts) => this.postSubject$.next(posts)),
        ),
      ),
    );
  }

  private getPostsFromStore(
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
      tap((posts) => this.postSubject$.next(posts)),
      finalize(() => this.isLoading$.next(false)),
    );
  }
}
