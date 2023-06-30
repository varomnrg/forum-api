const DetailThread = require("../../Domains/threads/entities/DetailThread");

class GetThreadDetailUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(threadId) {
        const thread = await this._threadRepository.getThreadById(threadId);
        const comments = await this._commentRepository.getCommentsByThreadId(threadId);
        const replies = await this._replyRepository.getRepliesByThreadId(threadId);

        const filteredComments = comments.map((comment) => {
            if (comment.is_delete === true) {
                comment.content = "**komentar telah dihapus**";
            }
            let filteredReplies = replies
                .filter((reply) => {
                    return reply.comment_id === comment.id;
                })
                .map((reply) => {
                    if (reply.is_delete === true) {
                        reply.content = "**balasan telah dihapus**";
                    }
                    let tempReply = {
                        id: reply.id,
                        username: reply.username,
                        date: reply.date,
                        content: reply.content,
                    };
                    return tempReply;
                })
                .sort((a, b) => {
                    return new Date(a.date) - new Date(b.date);
                });

            let tempComment = {
                id: comment.id,
                username: comment.username,
                date: comment.date,
                content: comment.content,
                replies: filteredReplies,
            };

            return tempComment;
        });

        return new DetailThread({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: thread.date,
            username: thread.username,
            comments: filteredComments,
        });
    }
}

module.exports = GetThreadDetailUseCase;
