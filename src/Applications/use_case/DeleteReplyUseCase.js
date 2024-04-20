class DeleteReplyUseCase {
    constructor({ replyRepository }) {
        this._replyRepository = replyRepository;
    }

    async execute(threadId, commentId, replyId, owner) {
        await this._replyRepository.verifyReplyById(replyId);
        await this._replyRepository.verifyReplyOwner(replyId, owner);
        return await this._replyRepository.deleteReply(threadId, commentId, replyId);
    }
}

module.exports = DeleteReplyUseCase;
