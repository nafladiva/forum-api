const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
    it('should orchestrating the add thread comment action correctly', async () => {
        const useCasePayload = {
            content: 'abc',
        };
        const threadIdParam = 'thread-123';
        const ownerPayload = 'user-123';

        const mockAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: ownerPayload,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verifyThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.addThreadComment = jest.fn()
            .mockImplementation(() => Promise.resolve(new AddedComment({
                id: 'comment-123',
                content: 'abc',
                owner: 'user-123',
            })));

        const addThreadCommentUseCase = new AddThreadCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        const addedComment = await addThreadCommentUseCase.execute(useCasePayload, threadIdParam, ownerPayload);

        expect(addedComment).toStrictEqual(mockAddedComment);
        expect(mockThreadRepository.verifyThreadById).toBeCalledWith(threadIdParam);
        expect(mockCommentRepository.addThreadComment).toBeCalledWith(new AddComment({
            content: useCasePayload.content,
        }), threadIdParam, ownerPayload);
    });
});