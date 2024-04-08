const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ username: 'nafla' });
    });

    describe('addThread function', () => {
        it('should persist add thread and return added thread correctly', async () => {
            const addThread = new AddThread({
                title: 'abc',
                body: 'abcd',
            });
            const owner = 'user-123';

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const addedThread = await threadRepositoryPostgres.addThread(addThread, owner);

            const thread = await ThreadsTableTestHelper.findThreadById('thread-123');

            expect(thread).toHaveLength(1);
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: 'abc',
                owner: 'user-123',
            }));
        });
    });

    describe('getThreadDetail function', () => {
        it('should persist get thread detail correctly', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            const threadId = 'thread-123';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            const threadDetail = await threadRepositoryPostgres.getThreadDetail(threadId);

            expect(threadDetail).toEqual(new ThreadDetail({
                id: 'thread-123',
                title: 'abc',
                body: 'abcd',
                date: '2021-08-08T07:59:18.982Z',
                username: 'nafla',
            }));
        });
    });

    describe('getThreadComments function', () => {
        it('should persist get thread comments correctly', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });

            const threadId = 'thread-123';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            const threadComments = await threadRepositoryPostgres.getThreadComments(threadId);

            expect(threadComments).toEqual([
                {
                    id: 'comment-123',
                    username: 'nafla',
                    date: '2021-08-08T07:59:18.982Z',
                    content: 'abc',
                    is_delete: false,
                },
            ]);
        });
    });

    describe('verifyThreadById function', () => {
        it('should not throw NotFoundError when thread exists', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await expect(threadRepositoryPostgres.verifyThreadById('thread-123')).resolves.not.toThrowError(NotFoundError);
        });

        it('should throw NotFoundError when thread is not exists', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await expect(threadRepositoryPostgres.verifyThreadById('thread-123')).rejects.toThrowError(NotFoundError);
        });
    });
});