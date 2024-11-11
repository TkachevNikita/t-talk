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
