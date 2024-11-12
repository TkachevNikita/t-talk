import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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
  ReplaySubject,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

import { CommentService } from './comment.service';
import { LikeService } from './like.service';

@Injectable()
export class PostService {
  private readonly fireStore: Firestore = inject(Firestore);
  private readonly postCollection = collection(this.fireStore, 'posts');
  private readonly likeService: LikeService = inject(LikeService);
  private readonly commentService: CommentService = inject(CommentService);
  private readonly isLoading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private readonly postSubject$: ReplaySubject<void> = new ReplaySubject<void>(
    1,
  );

  constructor() {
    this.refreshData();
  }

  public getPosts(userId: string): Observable<PostModel[]> {
    return this.postSubject$.pipe(
      switchMap(() => this.getPostsFromStore(userId)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  public createPost(post: IPost): Observable<PostModel[]> {
    return from(addDoc(this.postCollection, post)).pipe(
      switchMap(() =>
        this.getPostsFromStore(post.authorId).pipe(
          tap(() => this.refreshData()),
        ),
      ),
    );
  }

  public deletePost(post: PostModel): Observable<PostModel[]> {
    const postRef = doc(this.fireStore, `posts/${post.id}`);

    return from(deleteDoc(postRef)).pipe(
      switchMap(() =>
        this.likeService.deleteLikesByPostId(post.id!).pipe(
          switchMap(() => this.commentService.deleteCommentsByPostId(post.id!)),
          switchMap(() =>
            this.getPostsFromStore(post.authorId).pipe(
              tap(() => this.refreshData()),
            ),
          ),
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
      finalize(() => this.isLoading$.next(false)),
    );
  }

  private refreshData(): void {
    return this.postSubject$.next();
  }
}
