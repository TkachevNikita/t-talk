import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { CommentService } from './comment.service';
import { LikeService } from './like.service';
import { PostService } from './post.service';

jest.mock('@angular/fire/firestore');
jest.mock('./like.service');
jest.mock('./comment.service');

describe('PostService', () => {
  let service: PostService;
  let firestoreMock: jest.Mocked<Firestore>;
  let likeServiceMock: jest.Mocked<LikeService>;
  let commentServiceMock: jest.Mocked<CommentService>;

  beforeEach(() => {
    firestoreMock = {} as jest.Mocked<Firestore>;
    likeServiceMock = new LikeService() as jest.Mocked<LikeService>;
    commentServiceMock = new CommentService() as jest.Mocked<CommentService>;

    TestBed.configureTestingModule({
      providers: [
        PostService,
        { provide: Firestore, useValue: firestoreMock },
        { provide: LikeService, useValue: likeServiceMock },
        { provide: CommentService, useValue: commentServiceMock },
      ],
    });

    service = TestBed.inject(PostService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });
});
