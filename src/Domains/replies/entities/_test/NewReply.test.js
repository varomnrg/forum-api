const NewReply = require("../NewReply");

describe("New Reply entities", () => {
    it("should throw error when payload did not contain needed property", () => {
        // Arrange
        const payload = {
            threadId: "thread-123",
            content: "content",
            owner: "user-123",
        };

        // Action and Assert
        expect(() => new NewReply(payload)).toThrowError("NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it("should throw error when payload did not meet data type specification", () => {
        // Arrange
        const payload = {
            threadId: "thread-123",
            commentId: "comment-123",
            content: 123,
            owner: "user-123",
        };

        // Action and Assert
        expect(() => new NewReply(payload)).toThrowError("NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });
    it("should create newReply object correctly", () => {
        // Arrange
        const payload = {
            threadId: "thread-123",
            commentId: "comment-123",
            content: "content",
            owner: "user-123",
        };

        // Action
        const newReply = new NewReply(payload);

        // Assert
        expect(newReply.threadId).toEqual(payload.threadId);
        expect(newReply.commentId).toEqual(payload.commentId);
        expect(newReply.content).toEqual(payload.content);
        expect(newReply.owner).toEqual(payload.owner);
    });
});
