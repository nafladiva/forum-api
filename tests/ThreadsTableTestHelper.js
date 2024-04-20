const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123', title = 'abc', body = 'abcd', owner = 'user-123', date = '2021-08-08T07:59:18.982Z',
    }) {
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
            values: [id, title, body, owner, date],
        };

        await pool.query(query);
    },

    async addComment({
        id = 'comment-123', content = 'abc', threadId = 'thread-123', owner = 'user-123', isDelete = false, date = '2021-08-08T07:59:18.982Z',
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, content, threadId, owner, isDelete, date],
        };

        await pool.query(query);
    },

    async addReply({
        id = 'reply-123', content = 'abc', threadId = 'thread-123', commentId = 'comment-123', owner = 'user-123', isDelete = false, date = '2021-08-08T07:59:18.982Z',
    }) {
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
            values: [id, content, threadId, commentId, owner, isDelete, date],
        };

        await pool.query(query);
    },

    async findThreadById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async findCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async findReplyById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
        await pool.query('DELETE FROM comments WHERE 1=1');
        await pool.query('DELETE FROM threads WHERE 1=1');
    },
};

module.exports = ThreadsTableTestHelper;
