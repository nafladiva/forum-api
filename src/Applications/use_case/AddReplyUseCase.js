const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload, threadId, commentId, owner) {
        const addReply = new AddReply(useCasePayload);
        await this._threadRepository.verifyThreadById(threadId);
        await this._commentRepository.verifyCommentById(commentId);
        return await this._replyRepository.addReply(addReply, threadId, commentId, owner);
    }
}

module.exports = AddReplyUseCase;
