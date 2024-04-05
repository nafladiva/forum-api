const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
    it('should orchestrating the get thread action correctly', async () => {
        const payload = {
            threadId: '1',
        };

        const mockThreadDetail = new ThreadDetail({
            id: '1',
            title: 'abc',
            body: 'abc',
            date: '2021-08-08T07:22:33.555Z',
            username: 'nafla',
        });

        const mockCommentDetail = new CommentDetail({
            id: '1',
            username: 'nafla',
            date: '2021-08-08T07:22:33.555Z',
            content: 'abc',
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.getThread = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        const threads = await getThreadUseCase.execute(payload);

        //TODO
    });
});