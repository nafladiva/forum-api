const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
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

    describe('addThreadComment function', () => {
        it('should persist add thread comment and return added comment correctly', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            const addComment = {
                content: 'abc'
            };
            const threadId = 'thread-123';
            const owner = 'user-123';

            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            const addedComment = await commentRepositoryPostgres.addThreadComment(addComment, threadId, owner);

            const comment = await ThreadsTableTestHelper.findCommentById('comment-123');
            expect(comment).toHaveLength(1);
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

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await commentRepositoryPostgres.deleteThreadComment(threadId, commentId);

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

    describe('verifyCommentById function', () => {
        it('should not throw NotFoundError when comment exists', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await expect(commentRepositoryPostgres.verifyCommentById('comment-123')).resolves.not.toThrowError(NotFoundError);
        });

        it('should throw NotFoundError when comment is not exists', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await expect(commentRepositoryPostgres.verifyCommentById('comment-123')).rejects.toThrowError(NotFoundError);
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should not throw AuthorizationError when comment is owned by the owner', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
        });

        it('should throw AuthorizationError when comment is not owned by the owner', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError(AuthorizationError);
        });
    });
});