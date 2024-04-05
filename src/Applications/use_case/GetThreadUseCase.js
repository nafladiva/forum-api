class GetThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        return await this._threadRepository.getThread(useCasePayload);
    }
}

module.exports = GetThreadUseCase;
