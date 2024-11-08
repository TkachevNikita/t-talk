import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

export interface IPost {
  postId?: string;
  authorId: string;
  content: string;
  createdAt: Timestamp;
  mediaIds?: string[];
}
