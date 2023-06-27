const DetailThread = require("../../Domains/threads/entities/DetailThread");

class GetThreadDetailUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(threadId) {
        const thread = await this._threadRepository.getThreadById(threadId);
        const comments = await this._commentRepository.getCommentsByThreadId(threadId);

        const filteredComments = comments.map((comment) => {
            if (comment.is_delete === true) {
                comment.content = "**komentar telah dihapus**";
            }
            let tempComment = {
                id: comment.id,
                username: comment.username,
                date: comment.date,
                content: comment.content,
            };

            return tempComment;
        });

        return new DetailThread({
            ...thread,
            comments: filteredComments,
        });
    }
}

module.exports = GetThreadDetailUseCase;
