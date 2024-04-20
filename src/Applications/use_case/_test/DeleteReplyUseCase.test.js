const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
    it('should orchestrating the delete comment reply action correctly', async () => {
        const threadIdParam = 'thread-123';
        const commentIdParam = 'comment-123';
        const replyIdParam = 'reply-123';
        const ownerPayload = 'user-123'

        const mockReplyRepository = new ReplyRepository();

        mockReplyRepository.verifyReplyById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
        });

        await deleteReplyUseCase.execute(threadIdParam, commentIdParam, replyIdParam, ownerPayload);

        expect(mockReplyRepository.verifyReplyById).toBeCalledWith(replyIdParam);
        expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(replyIdParam, ownerPayload);
        expect(mockReplyRepository.deleteReply).toBeCalledWith(threadIdParam, commentIdParam, replyIdParam);
    });
});