const CommentDetail = require('../../Domains/comments/entities/CommentDetail');

class GetThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId) {
        const threadDetail = await this._threadRepository.getThreadDetail(threadId);
        const threadComments = await this._threadRepository.getThreadComments(threadId);

        threadComments.forEach(comment => {
            if (comment.is_delete) {
                comment.content = '**komentar telah dihapus**';
            }
        });
        const comments = threadComments.map((val) => new CommentDetail(val));

        return {
            ...threadDetail,
            comments,
        };
    }
}

module.exports = GetThreadUseCase;
