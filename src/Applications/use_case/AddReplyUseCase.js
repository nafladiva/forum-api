const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
    constructor({ commentRepository, replyRepository }) {
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload, commentId, owner) {
        const addReply = new AddReply(useCasePayload);
        await this._commentRepository.verifyCommentById(commentId);
        return await this._replyRepository.addReply(addReply, commentId, owner);
    }
}

module.exports = AddReplyUseCase;
