import type { IUser } from '@t-talk/shared';
import { Gender } from '@t-talk/shared';

export class UserModel {
  public readonly uid?: string;
  public readonly email: string;
  public readonly birthDate: Date;
  public readonly createdAt: Date;
  public readonly profilePictureId: string;
  public readonly bio: string;
  public readonly firstName: string;
  public readonly secondName: string;
  public readonly gender: Gender;

  constructor(user: IUser) {
    this.uid = user.uid;
    this.birthDate = user.birthDate;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.profilePictureId = user.profilePictureId;
    this.bio = user.bio;
    this.firstName = user.firstName;
    this.secondName = user.secondName;
    this.gender = this.getGender(user.gender);
  }

  public getGender(genderId: number): Gender {
    switch (genderId) {
      case 0:
        return Gender.male;
      case 1:
        return Gender.female;
      default:
        return Gender.male;
    }
  }
}
