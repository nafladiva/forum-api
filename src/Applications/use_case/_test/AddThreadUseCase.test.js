const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        const payload = {
            title: 'abc',
            body: 'abcd',
            owner: 'nafla',
        };

        const mockAddedThread = new AddedThread({
            id: '1',
            title: payload.title,
            owner: payload.owner,
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread));

        /** creating use case instance */
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await addThreadUseCase.execute(payload);

        // Assert
        expect(addedThread).toStrictEqual(mockAddedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: payload.title,
            body: payload.body,
            owner: payload.owner,
        }));
    });
});