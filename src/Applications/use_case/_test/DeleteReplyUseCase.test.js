const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("DeleteReplyUseCase", () => {
    it("should throw error if use case payload not contain needed property", async () => {
        // Arrange
        const useCasePayload = {};
        const deleteReplyUseCase = new DeleteReplyUseCase({});

        // Action & Assert
        await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrowError("DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw error if use case payload not meet data type specification", async () => {
        // Arrange
        const useCasePayload = {
            threadId: 123,
            commentId: 123,
            replyId: 123,
            owner: 123,
        };
        const deleteReplyUseCase = new DeleteReplyUseCase({});

        // Action & Assert
        await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrowError("DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should orchestrating the delete reply action correctly", async () => {
        const useCasePayload = {
            threadId: "thread-123",
            commentId: "comment-123",
            replyId: "reply-123",
            owner: "user-123",
        };

        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve());
        mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve());
        mockReplyRepository.verifyReplyAccess = jest.fn(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        await deleteReplyUseCase.execute(useCasePayload);

        expect(mockThreadRepository.isThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.isCommentExist).toHaveBeenCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.verifyReplyAccess).toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(useCasePayload.replyId);
    });
});
