const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
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

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await threadRepositoryPostgres.addThread(addThread);

            const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(thread).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            const addThread = new AddThread({
                title: 'abc',
                body: 'abcd',
            });

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const addedThread = await threadRepositoryPostgres.addThread(addThread);

            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: 'abc',
                body: 'abcd',
            }));
        });
    });

    describe('addThreadComment function', () => {
        it('should persist add thread comment and return added comment correctly', async () => {
            const addComment = {
                content: 'abc'
            };

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await threadRepositoryPostgres.addThreadComment(addComment);

            const thread = await ThreadsTableTestHelper.findCommentById('comment-123');
            expect(thread).toHaveLength(1);
        });

        it('should return added comment correctly', async () => {
            const threadId = 'thread-123';
            const content = 'abc';

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const addedComment = await threadRepositoryPostgres.addThreadComment(threadId, content);

            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: 'abc',
                owner: 'user-123', //TODO: check again
            }));
        });
    });

    // describe('deleteThreadComment function', () => {
    //     it('should persist delete thread comment', async () => {
    //         const fakeIdGenerator = () => '123'; // stub!
    //         const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

    //         await threadRepositoryPostgres.deleteThreadComment(addComment);

    //         const thread = await ThreadsTableTestHelper.findCommentById('comment-123');
    //         expect(thread).toHaveLength(1);
    //     });

    //     it('should return added comment correctly', async () => {
    //         const addComment = {
    //             content: 'abc'
    //         };

    //         const fakeIdGenerator = () => '123'; // stub!
    //         const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

    //         const addedComment = await threadRepositoryPostgres.addThreadComment(addComment);

    //         expect(addedComment).toStrictEqual(new AddedComment({
    //             id: 'comment-123',
    //             content: 'abc',
    //             owner: 'user-123', //TODO: check again
    //         }));
    //     });
    // });
});