const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/threads/entities/AddedComment');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../Domains/threads/entities/CommentDetail');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(addThread, owner) {
        const { title, body } = addThread;
        const id = `thread-${this._idGenerator()}`;

        // id, title, body, owner
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, title, body, owner],
        };

        const result = await this._pool.query(query);

        return new AddedThread({ ...result.rows[0] });
    }

    async addThreadComment(addComment, threadId, owner) {
        const { content } = addComment;
        const id = `comment-${this._idGenerator()}`;

        // id, content, threadId, owner, is_delete
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, content, threadId, owner, false],
        };

        const result = await this._pool.query(query);

        return new AddedComment({ ...result.rows[0] });
    }

    async deleteThreadComment(threadId, commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = $1 WHERE id = $2 AND thread_id = $3 AND is_delete = $4',
            values: [true, commentId, threadId, false],
        };

        await this._pool.query(query);
    }

    async getThread(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new InvariantError('thread tidak ditemukan di database');
        }

        return new ThreadDetail({ ...result.rows[0] });
    }

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('thread tidak ditemukan di database');
        }

        // return new ThreadDetail({ ...result.rows[0] });
    }

    async getCommentById(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('comment tidak ditemukan di database');
        }

        // return new CommentDetail({ ...result.rows[0] });
    }

    async getThreadComments(threadId) {
        const query = {
            text: 'SELECT * FROM comments WHERE threadId = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async verifyCommentOwner(commentId, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
            values: [commentId, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('user bukan pemilik comment tersebut');
        }
    }

}

module.exports = ThreadRepositoryPostgres;
