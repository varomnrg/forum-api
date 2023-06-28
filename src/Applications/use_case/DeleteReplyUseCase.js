class DeleteReplyUseCase {
    constructor({ replyRepository, threadRepository, commentRepository }) {
        this._replyRepository = replyRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        this._validatePayload(useCasePayload);
        const { threadId, commentId, replyId, owner } = useCasePayload;
        await this._threadRepository.isThreadExist(threadId);
        await this._commentRepository.isCommentExist(commentId);
        await this._replyRepository.verifyReplyAccess(replyId, owner);
        await this._replyRepository.deleteReply(replyId);
    }

    _validatePayload(payload) {
        const { threadId, commentId, replyId, owner } = payload;
        if (!threadId || !commentId || !replyId || !owner) {
            throw new Error("DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (typeof threadId !== "string" || typeof commentId !== "string" || typeof replyId !== "string" || typeof owner !== "string") {
            throw new Error("DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
    }
}

module.exports = DeleteReplyUseCase;
