const AddCommentUseCase = require("../AddCommentUseCase");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const NewComment = require("../../../Domains/comments/entities/NewComment");

describe("AddCommentUseCase", () => {
    it("should orchestrating the add comment action correctly", async () => {
        // Arrange
        const useCasePayload = {
            content: "comment content",
            owner: "user-123",
            threadId: "thread-123",
        };

        const mockAddedComment = new AddedComment({
            id: "comment-123",
            content: useCasePayload.content,
            owner: "user-123",
        });

        // Calling the use case
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        // Mock Function
        mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedComment));

        // Creating use case instance
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedComment).toStrictEqual(
            new AddedComment({
                id: "comment-123",
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            })
        );

        expect(mockCommentRepository.addComment).toBeCalledWith(
            new NewComment({
                content: useCasePayload.content,
                owner: useCasePayload.owner,
                threadId: useCasePayload.threadId,
            })
        );
    });
});
