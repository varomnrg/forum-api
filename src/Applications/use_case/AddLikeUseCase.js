class AddLikeUseCase {
    constructor({ likeRepository, threadRepository, commentRepository }) {
        this._likeRepository = likeRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        this._validatePayload(useCasePayload);
        const { threadId, commentId, owner } = useCasePayload;
        await this._threadRepository.isThreadExist(threadId);
        await this._commentRepository.verifyCommentAccess(commentId, owner);
        return this._likeRepository.addLike(useCasePayload);
    }

    _validatePayload(payload) {
        const { threadId, commentId, owner } = payload;
        if (!threadId || !commentId || !owner) {
            throw new Error("ADD_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (typeof threadId !== "string" || typeof commentId !== "string" || typeof owner !== "string") {
            throw new Error("ADD_LIKE_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
    }
}

module.exports = AddLikeUseCase;
