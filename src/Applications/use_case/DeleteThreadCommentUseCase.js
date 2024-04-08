class DeleteThreadCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    async execute(threadId, commentId, owner) {
        await this._commentRepository.verifyCommentById(commentId);
        await this._commentRepository.verifyCommentOwner(commentId, owner);
        return await this._commentRepository.deleteThreadComment(threadId, commentId);
    }
}

module.exports = DeleteThreadCommentUseCase;
