import { TestBed } from '@angular/core/testing';
import { addDoc, deleteDoc, Firestore, getDocs } from '@angular/fire/firestore';
import { CommentService } from '@t-talk/core';
import { Timestamp } from 'firebase/firestore';

jest.mock('@angular/fire/firestore');

describe('CommentService', () => {
  let service: CommentService;
  let firestoreMock: jest.Mocked<Firestore>;

  beforeEach(() => {
    firestoreMock = {} as jest.Mocked<Firestore>;

    TestBed.configureTestingModule({
      providers: [
        CommentService,
        { provide: Firestore, useValue: firestoreMock },
      ],
    });

    service = TestBed.inject(CommentService);
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('вызывает getComments и возвращает комментарии', (done) => {
    const postId = '123';
    const mockComments = [
      {
        id: '1',
        authorId: 'user1',
        postId,
        content: 'Comment 1',
        createdAt: Timestamp.now(),
      },
      {
        id: '2',
        authorId: 'user2',
        postId,
        content: 'Comment 2',
        createdAt: Timestamp.now(),
      },
    ];

    jest.mocked(getDocs).mockResolvedValue({
      docs: mockComments.map((comment) => ({
        id: comment.id,
        data: () => comment,
      })),
    } as any);

    service.getComments(postId).subscribe((comments) => {
      expect(comments.length).toBe(2);
      expect(comments[0].content).toBe('Comment 1');
      expect(comments[1].content).toBe('Comment 2');

      done();
    });
  });

  it('вызывает addComment и обновляет список', (done) => {
    const postId = '123';
    const newComment = {
      createdAt: Timestamp.now(),
      postId,
      authorId: 'user1',
      content: 'New comment',
    };

    jest.mocked(addDoc).mockResolvedValue({} as any);
    jest.mocked(getDocs).mockResolvedValue({
      docs: [{ id: '1', data: () => ({ ...newComment, id: '1' }) }],
    } as any);

    service.addComment(newComment).subscribe((comments) => {
      expect(comments.length).toBe(1);
      expect(comments[0].content).toBe('New comment');

      done();
    });
  });

  it('вызывает deleteCommentsByPostId и удаляет все комментарии', (done) => {
    const postId = '123';

    jest.mocked(getDocs).mockResolvedValue({
      docs: [{ ref: { id: '1' } }, { ref: { id: '2' } }],
    } as any);
    jest.mocked(deleteDoc).mockResolvedValue(undefined);

    service.deleteCommentsByPostId(postId).subscribe(() => {
      expect(deleteDoc).toHaveBeenCalledTimes(2);

      done();
    });
  });
});
