const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

        const { id: ownerId } = request.auth.credentials;
        const { threadId } = request.params;
        const { content } = request.payload;

        const addedComment = await addCommentUseCase.execute({
            content,
            owner: ownerId,
            threadId,
        });

        const response = h.response({
            status: "success",
            data: {
                addedComment,
            },
        });

        response.code(201);
        return response;
    }

    async deleteCommentByIdHandler(request, h) {
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

        const { id: owner } = request.auth.credentials;
        const { threadId, commentId } = request.params;

        await deleteCommentUseCase.execute({ threadId, commentId, owner });

        const response = h.response({
            status: "success",
        });

        response.code(200);
        return response;
    }
}

module.exports = CommentsHandler;
