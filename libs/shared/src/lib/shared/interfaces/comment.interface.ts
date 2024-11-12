import type { Timestamp } from 'firebase/firestore';

export interface IComment {
  id: string;
  content: string;
  createdAt: Timestamp;
  authorId: string;
  postId: string;
}
