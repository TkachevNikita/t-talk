import { TestBed } from '@angular/core/testing';
import {
  deleteDoc,
  Firestore,
  getDocs,
  runTransaction,
} from '@angular/fire/firestore';
import { LikeService } from '@t-talk/core';

jest.mock('@angular/fire/firestore');

describe('LikeService', () => {
  let service: LikeService;
  let firestoreMock: jest.Mocked<Firestore>;

  beforeEach(() => {
    firestoreMock = {} as jest.Mocked<Firestore>;

    TestBed.configureTestingModule({
      providers: [LikeService, { provide: Firestore, useValue: firestoreMock }],
    });

    service = TestBed.inject(LikeService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('вызывает setLike и добавляет лайк к посту', (done) => {
    const postId = 'post1';
    const userId = 'user1';

    jest.mocked(runTransaction).mockResolvedValue(undefined);

    service.setLike(postId, userId).subscribe(() => {
      expect(runTransaction).toHaveBeenCalledTimes(1);
      expect(runTransaction).toHaveBeenCalledWith(
        firestoreMock,
        expect.any(Function),
      );

      done();
    });
  });

  it('вызывает removeLike и удаляет лайк у поста', (done) => {
    const postId = 'post1';
    const userId = 'user1';

    jest.mocked(runTransaction).mockResolvedValue(undefined);
    jest.mocked(getDocs).mockResolvedValue({
      empty: false,
      docs: [{ ref: {} }],
    } as any);

    service.removeLike(postId, userId).subscribe(() => {
      expect(runTransaction).toHaveBeenCalledTimes(1);
      expect(runTransaction).toHaveBeenCalledWith(
        firestoreMock,
        expect.any(Function),
      );

      done();
    });
  });

  it('вызывает isLikeByUser и проверяет наличие лайка пользователя', (done) => {
    const postId = 'post1';
    const userId = 'user1';

    jest.mocked(getDocs).mockResolvedValue({
      empty: false,
    } as any);

    service.isLikeByUser(postId, userId).subscribe((isLiked) => {
      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(isLiked).toBe(true);

      done();
    });
  });

  it('вызывает deleteLikesByPostId и удаляет все лайки у поста', (done) => {
    const postId = 'post1';

    jest.mocked(getDocs).mockResolvedValue({
      docs: [{ ref: {} }, { ref: {} }],
    } as any);
    jest.mocked(deleteDoc).mockResolvedValue(undefined);

    service.deleteLikesByPostId(postId).subscribe((results) => {
      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(deleteDoc).toHaveBeenCalledTimes(2);

      done();
    });
  });
});
