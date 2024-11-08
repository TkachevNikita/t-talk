import type { IPost } from '../interfaces/post.interface';

export class PostModel {
  public readonly id?: string;
  public readonly authorId: string;
  public readonly content: string;
  public readonly createdAt: Date;
  public readonly mediaIds?: string[];

  constructor(post: IPost) {
    this.id = post.postId;
    this.authorId = post.authorId;
    this.content = post.content;
    this.createdAt = post.createdAt.toDate();
    this.mediaIds = post.mediaIds;
  }
}
