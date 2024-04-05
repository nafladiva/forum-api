const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
    it('should orchestrating the add thread comment action correctly', async () => {
        const payload = {
            threadId: '1',
            content: 'abc',
        };

        const mockAddedComment = new AddedComment({
            id: '1',
            content: payload.content,
            owner: 'nafla',
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThreadComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment));

        const addThreadCommentUseCase = new AddThreadCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        const addedComment = await addThreadCommentUseCase.execute(payload);

        expect(addedComment).toStrictEqual(mockAddedComment);
        expect(mockThreadRepository.addThreadComment).toBeCalledWith({
            threadId: payload.threadId,
            content: payload.content,
        });
    });
});