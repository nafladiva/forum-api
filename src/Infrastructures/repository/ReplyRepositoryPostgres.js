const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(addReply, threadId, commentId, owner) {
        const { content } = addReply;
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();

        // id, content, threadId, commentId, owner, is_delete, date
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
            values: [id, content, threadId, commentId, owner, false, date],
        };

        const result = await this._pool.query(query);

        return new AddedReply({ ...result.rows[0] });
    }

    async deleteReply(threadId, commentId, replyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = $1 WHERE id = $2 AND thread_id = $3 AND comment_id = $4 AND is_delete = $5',
            values: [true, replyId, threadId, commentId, false],
        };

        await this._pool.query(query);
    }

    async verifyReplyById(replyId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('reply tidak ditemukan di database');
        }
    }

    async verifyReplyOwner(replyId, owner) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
            values: [replyId, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('user bukan pemilik reply tersebut');
        }
    }
}

module.exports = ReplyRepositoryPostgres;
