class DeleteCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        this._validatePayload(useCasePayload);
        const { threadId, commentId, owner } = useCasePayload;
        await this._commentRepository.verifyCommentAccess(threadId, commentId, owner);
        await this._commentRepository.deleteComment(commentId);
    }

    _validatePayload(payload) {
        const { threadId, commentId, owner } = payload;
        if (!threadId || !commentId || !owner) {
            throw new Error("DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (typeof threadId !== "string" || typeof commentId !== "string" || typeof owner !== "string") {
            throw new Error("DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
    }
}

module.exports = DeleteCommentUseCase;
