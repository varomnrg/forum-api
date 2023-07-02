const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DeleteCommentUseCase", () => {
    it("should throw error if use case payload not contain needed property", async () => {
        // Arrange
        const useCasePayload = {};
        const deleteCommentUseCase = new DeleteCommentUseCase({});

        // Action & Assert
        await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError("DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw error if use case payload not meet data type specification", async () => {
        // Arrange
        const useCasePayload = {
            threadId: 123,
            commentId: 123,
            owner: 123,
        };

        const deleteCommentUseCase = new DeleteCommentUseCase({});

        // Action & Assert
        await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError("DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should orchestrating the delete comment action correctly", async () => {
        // Arrange
        const useCasePayload = {
            threadId: "thread-123",
            commentId: "comment-123",
            owner: "user-123",
        };
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentAccess = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve("comment-123"));

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.isThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentAccess).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.commentId);
    });
});
