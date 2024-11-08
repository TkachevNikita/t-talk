import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

export interface IUser {
  uid?: string;
  email: string;
  birthDate: Timestamp;
  createdAt: Timestamp;
  profilePictureId: string;
  bio: string;
  firstName: string;
  secondName: string;
  gender: number;
  password: string;
  friends: string[];
  conversations: string[];
}

// export interface IPost {
//   postId: string;
//   authorId: string;
//   content: string;
//   createdAt: number;
//   mediaIds?: string[];
//   likeCount: number;
//   commentCount: number;
// }

export interface IComment {
  commentId: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface ILike {
  likeId: string;
  postId: string;
  userId: string;
}

//
// export interface IComment {
//   commentId: string;
//   authorId: string;
//   content: string;
//   createdAt: Date;
// }
//
// export interface IChat {
//   conversationId: string;
//   participants: string[];
//   lastUpdated: Date;
// }
//
// export interface IMessage {
//   messageId: string;
//   senderId: string;
//   chatId: string;
//   content: string;
//   sentAt: Date;
// }
//
// export interface IFriendRequest {
//   requestId: string;
//   senderId: string;
//   receiverId: string;
//   status: 'accepted' | 'declined' | 'pending';
//   sentAt: Date;
// }
