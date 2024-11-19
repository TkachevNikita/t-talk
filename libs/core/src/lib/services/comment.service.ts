import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  Firestore,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { CommentModel, IComment } from '@t-talk/shared';
import { Timestamp } from 'firebase/firestore';
import {
  from,
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

@Injectable()
export class CommentService {
  private readonly fireStore: Firestore = inject(Firestore);
  private readonly commentCollection = collection(this.fireStore, 'comments');
  private readonly refreshSubject$: ReplaySubject<void> =
    new ReplaySubject<void>(1);

  constructor() {
    this.refreshSubject$.next();
  }

  public getComments(postId: string): Observable<CommentModel[]> {
    return this.refreshSubject$.pipe(
      switchMap(() => this.fetchCommentsFromStore(postId)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  public addComment(comment: {
    createdAt: Timestamp;
    postId: string;
    authorId: string;
    content: string;
  }): Observable<CommentModel[]> {
    return from(addDoc(this.commentCollection, comment)).pipe(
      switchMap(() => this.fetchCommentsFromStore(comment.postId)),
      tap(() => this.refreshData()),
    );
  }

  public deleteCommentsByPostId(postId: string): Observable<void[]> {
    const commentsQuery = query(
      this.commentCollection,
      where('postId', '==', postId),
    );

    return from(getDocs(commentsQuery)).pipe(
      switchMap((snapshot) =>
        from(Promise.all(snapshot.docs.map(async (doc) => deleteDoc(doc.ref)))),
      ),
    );
  }

  private fetchCommentsFromStore(postId: string): Observable<CommentModel[]> {
    const commentsQuery = query(
      this.commentCollection,
      where('postId', '==', postId),
      orderBy('createdAt', 'asc'),
    );

    return from(getDocs(commentsQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map(
          (doc) => new CommentModel({ id: doc.id, ...doc.data() } as IComment),
        ),
      ),
    );
  }

  private refreshData(): void {
    this.refreshSubject$.next();
  }
}
