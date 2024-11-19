import { TestBed } from '@angular/core/testing';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { UserService } from '@t-talk/core';
import type { IUser } from '@t-talk/shared';
import { Gender, UserModel } from '@t-talk/shared';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject, of } from 'rxjs';

import { FollowerService } from './follower.service';

jest.mock('@angular/fire/firestore');

describe('FollowerService', () => {
  let service: FollowerService;
  let firestoreMock: jest.Mocked<Firestore>;
  let userServiceMock: Partial<UserService>;

  beforeEach(() => {
    firestoreMock = {} as jest.Mocked<Firestore>;

    const mockCurrentUser = new UserModel({
      uid: 'currentUserId',
      email: 'current@example.com',
      firstName: 'Current',
      secondName: 'User',
      profilePictureId: 'profilePic',
      bio: 'Hello World',
      gender: Gender.male,
    } as IUser);

    const currentUserSubject$ = new BehaviorSubject<UserModel>(mockCurrentUser);

    userServiceMock = {
      currentUser$: currentUserSubject$.asObservable(),
      getUserById: jest.fn((userId: string) =>
        of(
          new UserModel({
            uid: userId,
            email: `${userId}@example.com`,
            firstName: 'Test',
            secondName: `User${userId}`,
            profilePictureId: 'profilePic',
            bio: 'Test Bio',
            gender: Gender.female,
          } as IUser),
        ),
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        FollowerService,
        { provide: Firestore, useValue: firestoreMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    });

    service = TestBed.inject(FollowerService);
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('вызывает followUser и добавляет пользователя в подписки', (done) => {
    const currentUserId = 'currentUserId';
    const targetUserId = 'targetUserId';

    const followingRef = doc(
      firestoreMock,
      'followers',
      currentUserId,
      'following',
      targetUserId,
    );
    const followersRef = doc(
      firestoreMock,
      'followers',
      targetUserId,
      'followers',
      currentUserId,
    );

    jest.mocked(setDoc).mockResolvedValue(undefined);

    service.followUser(currentUserId, targetUserId).subscribe(() => {
      expect(setDoc).toHaveBeenCalledTimes(2);
      expect(setDoc).toHaveBeenCalledWith(followingRef, {});
      expect(setDoc).toHaveBeenCalledWith(followersRef, {});

      done();
    });
  });

  it('вызывает unfollowUser и удаляет пользователя из подписок', (done) => {
    const currentUserId = 'currentUserId';
    const targetUserId = 'targetUserId';

    const followingRef = doc(
      firestoreMock,
      'followers',
      currentUserId,
      'following',
      targetUserId,
    );
    const followersRef = doc(
      firestoreMock,
      'followers',
      targetUserId,
      'followers',
      currentUserId,
    );

    jest.mocked(deleteDoc).mockResolvedValue(undefined);

    service.unfollowUser(currentUserId, targetUserId).subscribe(() => {
      expect(deleteDoc).toHaveBeenCalledTimes(2);
      expect(deleteDoc).toHaveBeenCalledWith(followingRef);
      expect(deleteDoc).toHaveBeenCalledWith(followersRef);

      done();
    });
  });

  it('вызывает getFollowing и возвращает список подписок пользователя', (done) => {
    const userId = 'currentUserId';
    const followingIds = ['user1', 'user2'];
    const mockDocs = followingIds.map((id) => ({ id }));

    jest.mocked(getDocs).mockResolvedValue({
      docs: mockDocs,
    } as any);

    jest
      .spyOn(userServiceMock, 'getUserById')
      .mockImplementation((id: string) =>
        of(
          new UserModel({
            uid: id,
            email: `${id}@example.com`,
            firstName: 'Test',
            secondName: `User${id}`,
            profilePictureId: 'profilePic',
            bio: 'Test Bio',
            gender: Gender.female,
          } as IUser),
        ),
      );

    service.getFollowing(userId).subscribe((users) => {
      expect(getDocs).toHaveBeenCalledWith(
        collection(firestoreMock, 'followers', userId, 'following'),
      );
      expect(users.length).toBe(followingIds.length);
      expect(users[0].uid).toBe('user1');
      expect(users[1].uid).toBe('user2');

      done();
    });
  });

  it('вызывает getFollowers и возвращает список подписчиков пользователя', (done) => {
    const userId = 'currentUserId';
    const followerIds = ['user3', 'user4'];
    const mockDocs = followerIds.map((id) => ({ id }));

    jest.mocked(getDocs).mockResolvedValue({
      docs: mockDocs,
    } as any);

    jest
      .spyOn(userServiceMock, 'getUserById')
      .mockImplementation((id: string) =>
        of(
          new UserModel({
            uid: id,
            email: `${id}@example.com`,
            firstName: 'Follower',
            secondName: `User${id}`,
            profilePictureId: 'profilePic',
            bio: 'Follower Bio',
            gender: Gender.male,
          } as IUser),
        ),
      );

    service.getFollowers(userId).subscribe((users) => {
      expect(getDocs).toHaveBeenCalledWith(
        collection(firestoreMock, 'followers', userId, 'followers'),
      );
      expect(users.length).toBe(followerIds.length);
      expect(users[0].uid).toBe('user3');
      expect(users[1].uid).toBe('user4');

      done();
    });
  });

  it('вызывает getCurrentUsingFollowings и возвращает подписки текущего пользователя', (done) => {
    const mockUser: IUser = {
      birthDate: Timestamp.now(),
      createdAt: Timestamp.now(),
      uid: 'user1',
      email: 'user1@example.com',
      profilePictureId: 'pic1',
      bio: 'Bio 1',
      firstName: 'User',
      secondName: 'One',
      gender: 0,
    };

    jest
      .spyOn(service, 'getFollowing')
      .mockReturnValue(of([new UserModel(mockUser)]));

    service.getCurrentUsingFollowings().subscribe((users) => {
      expect(users.length).toBe(1);
      expect(users[0].uid).toBe('user1');

      done();
    });
  });
});
