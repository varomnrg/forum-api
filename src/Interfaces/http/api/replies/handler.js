const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class RepliesHandler {
    constructor(container) {
        this._container = container;

        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

        const { threadId, commentId } = request.params;
        const { id: owner } = request.auth.credentials;
        const { content } = request.payload;
        const payload = {
            threadId,
            commentId,
            content,
            owner,
        };

        const addedReply = await addReplyUseCase.execute(payload);

        const response = h.response({
            status: "success",
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyByIdHandler(request, h) {
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        const { threadId, commentId, replyId } = request.params;
        const { id: owner } = request.auth.credentials;
        const payload = {
            threadId,
            commentId,
            replyId,
            owner,
        };
        await deleteReplyUseCase.execute(payload);
        return {
            status: "success",
        };
    }
}

module.exports = RepliesHandler;
