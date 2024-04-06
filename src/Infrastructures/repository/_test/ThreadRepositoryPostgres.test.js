const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/threads/entities/CommentDetail');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ThreadRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ username: 'nafla' });
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
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

    describe('addThreadComment function', () => {
        it('should persist add thread comment and return added comment correctly', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            const addComment = {
                content: 'abc'
            };
            const threadId = 'thread-123';
            const owner = 'user-123';

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const addedComment = await threadRepositoryPostgres.addThreadComment(addComment, threadId, owner);

            const thread = await ThreadsTableTestHelper.findCommentById('comment-123');
            expect(thread).toHaveLength(1);
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: 'abc',
                owner: 'user-123',
            }));
        });
    });

    describe('deleteThreadComment function', () => {
        it('should persist delete thread comment correctly', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });

            const threadId = 'thread-123';
            const commentId = 'comment-123';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            await threadRepositoryPostgres.deleteThreadComment(threadId, commentId);

            const comment = await ThreadsTableTestHelper.findCommentById('comment-123');
            expect(comment[0]).toStrictEqual({
                id: 'comment-123',
                content: 'abc',
                thread_id: 'thread-123',
                owner: 'user-123',
                is_delete: true,
                date: '2021-08-08T07:59:18.982Z',
            });
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
                new CommentDetail({
                    id: 'comment-123',
                    username: 'nafla',
                    date: '2021-08-08T07:59:18.982Z',
                    content: 'abc',
                }),
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

    describe('verifyCommentById function', () => {
        it('should not throw NotFoundError when comment exists', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await expect(threadRepositoryPostgres.verifyCommentById('comment-123')).resolves.not.toThrowError(NotFoundError);
        });

        it('should throw NotFoundError when comment is not exists', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await expect(threadRepositoryPostgres.verifyCommentById('comment-123')).rejects.toThrowError(NotFoundError);
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should not throw AuthorizationError when comment is owned by the owner', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
        });

        it('should throw AuthorizationError when comment is not owned by the owner', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError(AuthorizationError);
        });
    });
});