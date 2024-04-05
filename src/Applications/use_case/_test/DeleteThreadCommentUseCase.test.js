const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
    it('should orchestrating the delete thread comment action correctly', async () => {
        const payload = {
            threadId: '1',
            commentId: '1',
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.deleteThreadComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        await deleteThreadCommentUseCase.execute(payload);

        expect(mockThreadRepository.deleteThreadComment).toBeCalledWith({
            threadId: payload.threadId,
            commentId: payload.commentId,
        });
    });
});