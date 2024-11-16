import type { Timestamp } from 'firebase/firestore';

export interface IFollower {
  id?: string;
  followerId: string;
  followingId: string;
  createdAt: Timestamp;
}
