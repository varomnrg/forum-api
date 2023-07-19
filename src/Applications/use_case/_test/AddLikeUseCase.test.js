const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const AddLikeUseCase = require("../AddLikeUseCase");

describe("AddLikeUseCase", () => {
    it("should throw error if use case payload not contain needed property", async () => {
        // Arrange
        const useCasePayload = {};
        const addLikeUseCase = new AddLikeUseCase({});

        // Action & Assert
        await expect(addLikeUseCase.execute(useCasePayload)).rejects.toThrowError("ADD_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw error if use case payload not meet data type specification", async () => {
        // Arrange
        const useCasePayload = {
            threadId: 123,
            commentId: 123,
            owner: 123,
        };

        const addLikeUseCase = new AddLikeUseCase({});

        // Action & Assert
        await expect(addLikeUseCase.execute(useCasePayload)).rejects.toThrowError("ADD_LIKE_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
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
        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentAccess = jest.fn().mockImplementation(() => Promise.resolve());
        mockLikeRepository.addLike = jest.fn().mockImplementation(() => Promise.resolve("like-123"));

        const addLikeUseCase = new AddLikeUseCase({
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await addLikeUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.isThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentAccess).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockLikeRepository.addLike).toHaveBeenCalledWith(useCasePayload);
    });
});
