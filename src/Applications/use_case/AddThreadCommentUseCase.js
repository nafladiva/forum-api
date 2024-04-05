const AddComment = require('../../Domains/threads/entities/AddComment');

class AddThreadCommentUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload, threadId, owner) {
        const addComment = new AddComment(useCasePayload);
        await this._threadRepository.getThreadById(threadId);
        return await this._threadRepository.addThreadComment(addComment, threadId, owner);
    }
}

module.exports = AddThreadCommentUseCase;
