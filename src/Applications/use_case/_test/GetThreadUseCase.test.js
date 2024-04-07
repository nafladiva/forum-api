const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/threads/entities/CommentDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
    it('should orchestrating the get thread action correctly', async () => {
        const threadIdParam = 'thread-123';

        const mockThreadDetail = new ThreadDetail({
            id: 'thread-123',
            title: 'abc',
            body: 'abcd',
            date: '2021-08-08T07:19:09.775Z',
            username: 'nafla',
        });
        const mockThreadComments = [
            new CommentDetail({
                id: 'comment-123',
                username: 'nafla',
                date: '2021-08-09T07:19:09.775Z',
                content: 'abcd',
            }),
        ];

        const mockResult = {
            ...mockThreadDetail,
            comments: mockThreadComments,
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.getThreadDetail = jest.fn()
            .mockImplementation(() => Promise.resolve(new ThreadDetail({
                id: 'thread-123',
                title: 'abc',
                body: 'abcd',
                date: '2021-08-08T07:19:09.775Z',
                username: 'nafla',
            })));
        mockThreadRepository.getThreadComments = jest.fn()
            .mockImplementation(() => Promise.resolve([
                new CommentDetail({
                    id: 'comment-123',
                    username: 'nafla',
                    date: '2021-08-09T07:19:09.775Z',
                    content: 'abcd',
                }),
            ]));

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        const result = await getThreadUseCase.execute(threadIdParam);

        expect(result).toStrictEqual(mockResult);
        expect(mockThreadRepository.getThreadDetail).toBeCalledWith(threadIdParam);
        expect(mockThreadRepository.getThreadComments).toBeCalledWith(threadIdParam);
    });
});