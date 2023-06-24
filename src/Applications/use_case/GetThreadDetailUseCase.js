class GetThreadDetailUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId) {
        return this._threadRepository.getThreadById(threadId);
    }
}

module.exports = GetThreadDetailUseCase;