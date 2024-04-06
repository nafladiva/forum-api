const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        const useCasePayload = {
            title: 'abc',
            body: 'abcd',
        };
        const ownerPayload = 'user-123';

        const mockAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: ownerPayload,
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread));

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        const addedThread = await addThreadUseCase.execute(useCasePayload, ownerPayload);

        expect(addedThread).toStrictEqual(mockAddedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
        }), ownerPayload);
    });
});