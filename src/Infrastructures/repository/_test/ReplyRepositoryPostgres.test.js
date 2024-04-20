const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
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

    describe('addReply function', () => {
        it('should persist add comment reply and return added reply correctly', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });

            const addReply = {
                content: 'abc'
            };
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const owner = 'user-123';

            const fakeIdGenerator = () => '123'; // stub!
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            const addedReply = await replyRepositoryPostgres.addReply(addReply, threadId, commentId, owner);

            const reply = await ThreadsTableTestHelper.findReplyById('reply-123');
            expect(reply).toHaveLength(1);
            expect(addedReply).toStrictEqual(new AddedReply({
                id: 'reply-123',
                content: 'abc',
                owner: 'user-123',
            }));
        });
    });

    describe('deleteReply function', () => {
        it('should persist delete comment reply correctly', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });
            await ThreadsTableTestHelper.addReply({ id: 'reply-123' });

            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            await replyRepositoryPostgres.deleteReply(threadId, commentId, replyId);

            const reply = await ThreadsTableTestHelper.findReplyById('reply-123');
            expect(reply[0]).toStrictEqual({
                id: 'reply-123',
                content: 'abc',
                thread_id: 'thread-123',
                comment_id: 'comment-123',
                owner: 'user-123',
                is_delete: true,
                date: '2021-08-08T07:59:18.982Z',
            });
        });
    });

    describe('verifyReplyById function', () => {
        it('should not throw NotFoundError when reply exists', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });
            await ThreadsTableTestHelper.addReply({ id: 'reply-123' });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await expect(replyRepositoryPostgres.verifyReplyById('reply-123')).resolves.not.toThrowError(NotFoundError);
        });

        it('should throw NotFoundError when comment is not exists', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await expect(replyRepositoryPostgres.verifyReplyById('reply-123')).rejects.toThrowError(NotFoundError);
        });
    });

    describe('verifyReplyOwner function', () => {
        it('should not throw AuthorizationError when reply is owned by the owner', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await ThreadsTableTestHelper.addComment({ id: 'comment-123' });
            await ThreadsTableTestHelper.addReply({ id: 'reply-123' });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
        });

        it('should throw AuthorizationError when reply is not owned by the owner', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).rejects.toThrowError(AuthorizationError);
        });
    });
});