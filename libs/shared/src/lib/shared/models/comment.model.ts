import type { IComment } from '../interfaces/comment.interface';

export class CommentModel {
  public readonly id?: string;
  public readonly content: string;
  public readonly createdAt: Date;
  public readonly postId: string;
  public readonly authorId: string;

  constructor(comment: IComment) {
    this.id = comment.id;
    this.content = comment.content;
    this.createdAt = comment.createdAt.toDate();
    this.postId = comment.postId;
    this.authorId = comment.authorId;
  }
}
