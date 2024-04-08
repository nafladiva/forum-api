const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
    it('should orchestrating the delete thread comment action correctly', async () => {
        const threadIdParam = 'thread-123';
        const commentIdParam = 'comment-123';
        const ownerPayload = 'user-123'

        const mockCommentRepository = new CommentRepository();

        mockCommentRepository.verifyCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteThreadComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
            commentRepository: mockCommentRepository,
        });

        await deleteThreadCommentUseCase.execute(threadIdParam, commentIdParam, ownerPayload);

        expect(mockCommentRepository.verifyCommentById).toBeCalledWith(commentIdParam);
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentIdParam, ownerPayload);
        expect(mockCommentRepository.deleteThreadComment).toBeCalledWith(threadIdParam, commentIdParam);
    });
});