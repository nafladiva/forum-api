const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
    it('should orchestrating the add thread reply action correctly', async () => {
        const useCasePayload = {
            content: 'abc',
        };
        const threadIdParam = 'thread-123';
        const commentIdParam = 'comment-123';
        const ownerPayload = 'user-123';

        const mockAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: ownerPayload,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(new AddedReply({
                id: 'reply-123',
                content: 'abc',
                owner: 'user-123',
            })));

        const addReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        const addedReply = await addReplyUseCase.execute(useCasePayload, threadIdParam, commentIdParam, ownerPayload);

        expect(addedReply).toStrictEqual(mockAddedReply);
        expect(mockThreadRepository.verifyThreadById).toBeCalledWith(threadIdParam);
        expect(mockCommentRepository.verifyCommentById).toBeCalledWith(commentIdParam);
        expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
            content: useCasePayload.content,
        }), threadIdParam, commentIdParam, ownerPayload);
    });
});