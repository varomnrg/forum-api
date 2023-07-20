const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const UpdateLikeUseCase = require("../UpdateLikeUseCase");

describe("AddLikeUseCase", () => {
    it("should throw error if use case payload not contain needed property", async () => {
        // Arrange
        const useCasePayload = {};
        const updateLikeUseCase = new UpdateLikeUseCase({});

        // Action & Assert
        await expect(updateLikeUseCase.execute(useCasePayload)).rejects.toThrowError("ADD_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw error if use case payload not meet data type specification", async () => {
        // Arrange
        const useCasePayload = {
            threadId: 123,
            commentId: 123,
            owner: 123,
        };

        const updateLikeUseCase = new UpdateLikeUseCase({});

        // Action & Assert
        await expect(updateLikeUseCase.execute(useCasePayload)).rejects.toThrowError("ADD_LIKE_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should orchestrating the delete comment action correctly if like doesnt exist", async () => {
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
        mockCommentRepository.isCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockLikeRepository.checkLike = jest.fn().mockImplementation(() => Promise.resolve(false));
        mockLikeRepository.addLike = jest.fn().mockImplementation(() => Promise.resolve());

        const updateLikeUseCase = new UpdateLikeUseCase({
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await updateLikeUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.isThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.isCommentExist).toHaveBeenCalledWith(useCasePayload.commentId);
        expect(mockLikeRepository.checkLike).toHaveBeenCalledWith(useCasePayload);
        expect(mockLikeRepository.addLike).toHaveBeenCalledWith(useCasePayload);
    });

    it("should orchestrating the delete comment action correctly if like does exist", async () => {
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
        mockCommentRepository.isCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockLikeRepository.checkLike = jest.fn().mockImplementation(() => Promise.resolve(true));
        mockLikeRepository.removeLike = jest.fn().mockImplementation(() => Promise.resolve());

        const updateLikeUseCase = new UpdateLikeUseCase({
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await updateLikeUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.isThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.isCommentExist).toHaveBeenCalledWith(useCasePayload.commentId);
        expect(mockLikeRepository.checkLike).toHaveBeenCalledWith(useCasePayload);
        expect(mockLikeRepository.removeLike).toHaveBeenCalledWith(useCasePayload);
    });
});
