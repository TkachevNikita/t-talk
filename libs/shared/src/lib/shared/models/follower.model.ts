import type { IFollower } from '../interfaces/follower.interface';

export class FollowerModel {
  public readonly id?: string;
  public readonly followerId: string;
  public readonly followingId: string;
  public readonly createdAt: Date;

  constructor(follower: IFollower) {
    this.id = follower.id;
    this.followerId = follower.followerId;
    this.followingId = follower.followingId;
    this.createdAt = follower.createdAt.toDate();
  }
}
