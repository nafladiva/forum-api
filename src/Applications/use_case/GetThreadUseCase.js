class GetThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId) {

        const threadDetail = await this._threadRepository.getThreadDetail(threadId);
        const threadComments = await this._threadRepository.getThreadComments(threadId);

        return {
            ...threadDetail,
            comments: threadComments,
        };
    }
}

module.exports = GetThreadUseCase;
