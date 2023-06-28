const NewReply = require("../../Domains/replies/entities/NewReply");

class AddReplyUseCase {
    constructor({ replyRepository, threadRepository, commentRepository }) {
        this._replyRepository = replyRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const newReply = new NewReply(useCasePayload);
        await this._threadRepository.isThreadExist(newReply.threadId);
        await this._commentRepository.isCommentExist(newReply.commentId);
        return this._replyRepository.addReply(newReply);
    }
}

module.exports = AddReplyUseCase;
