const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
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
        const date = new Date().toISOString();

        // id, title, body, owner, date
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, owner, date],
        };

        const result = await this._pool.query(query);

        return new AddedThread({ ...result.rows[0] });
    }

    async getThreadDetail(threadId) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads
            INNER JOIN users ON threads.owner = users.id
            WHERE threads.id = $1`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return new ThreadDetail({ ...result.rows[0] });
    }

    async getThreadComments(threadId) {
        const query = {
            text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete FROM comments
            INNER JOIN users ON comments.owner = users.id
            WHERE comments.thread_id = $1
            ORDER BY comments.date`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async verifyThreadById(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('thread tidak ditemukan di database');
        }
    }
}

module.exports = ThreadRepositoryPostgres;
