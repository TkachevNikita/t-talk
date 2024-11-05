import type { IUser } from '@t-talk/shared';

export interface IAuthService {
  register(user: IUser): void;
  login(email: string, password: string): void;
}
