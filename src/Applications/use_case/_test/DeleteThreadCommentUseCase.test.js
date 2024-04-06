const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
    it('should orchestrating the delete thread comment action correctly', async () => {
        const threadIdParam = 'thread-123';
        const commentIdParam = 'comment-123';
        const ownerPayload = 'user-123'

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.deleteThreadComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        await deleteThreadCommentUseCase.execute(threadIdParam, commentIdParam, ownerPayload);

        expect(mockThreadRepository.deleteThreadComment).toBeCalledWith(threadIdParam, commentIdParam);
    });
});