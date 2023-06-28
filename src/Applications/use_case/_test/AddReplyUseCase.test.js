const NewReply = require("../../../Domains/replies/entities/NewReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
    it("should orchestrating the add reply action correctly", async () => {
        // Arrange
        const useCasePayload = {
            content: "reply content",
            owner: "user-123",
            threadId: "thread-123",
            commentId: "comment-123",
        };

        const mockAddedReply = new AddedReply({
            id: "reply-123",
            content: useCasePayload.content,
            owner: "user-123",
        });

        // Calling the use case
        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // Mock Function
        mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.isCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(mockAddedReply));

        // Creating use case instance
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(addedReply).toStrictEqual(
            new AddedReply({
                id: "reply-123",
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            })
        );

        expect(mockReplyRepository.addReply).toBeCalledWith(
            new NewReply({
                content: useCasePayload.content,
                owner: useCasePayload.owner,
                commentId: useCasePayload.commentId,
                threadId: useCasePayload.threadId,
            })
        );
    });
});
