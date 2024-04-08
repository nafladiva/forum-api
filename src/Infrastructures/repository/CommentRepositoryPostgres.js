const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThreadComment(addComment, threadId, owner) {
        const { content } = addComment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        // id, content, threadId, owner, is_delete, date
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, content, threadId, owner, false, date],
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

    async verifyCommentById(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('comment tidak ditemukan di database');
        }
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

module.exports = CommentRepositoryPostgres;
