const AddComment = require('../../../Domains/threads/entities/AddComment');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
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

        mockThreadRepository.verifyThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.addThreadComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment));

        const addThreadCommentUseCase = new AddThreadCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        const addedComment = await addThreadCommentUseCase.execute(useCasePayload, threadIdParam, ownerPayload);

        expect(addedComment).toStrictEqual(mockAddedComment);
        expect(mockThreadRepository.addThreadComment).toBeCalledWith(new AddComment({
            content: useCasePayload.content,
        }), threadIdParam, ownerPayload);
    });
});