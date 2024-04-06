class DeleteThreadCommentUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId, commentId, owner) {
        await this._threadRepository.verifyCommentById(commentId);
        await this._threadRepository.verifyCommentOwner(commentId, owner);
        return await this._threadRepository.deleteThreadComment(threadId, commentId);
    }
}

module.exports = DeleteThreadCommentUseCase;
