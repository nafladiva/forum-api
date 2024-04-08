const AddComment = require('../../Domains/comments/entities/AddComment');

class AddThreadCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload, threadId, owner) {
        const addComment = new AddComment(useCasePayload);
        await this._threadRepository.verifyThreadById(threadId);
        return await this._commentRepository.addThreadComment(addComment, threadId, owner);
    }
}

module.exports = AddThreadCommentUseCase;
