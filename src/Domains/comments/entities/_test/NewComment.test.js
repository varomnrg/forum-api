const NewComment = require("../NewComment");

describe("a NewComment entitties", () => {
    it("should throw an error when payload did not contain needed property", () => {
        //Arrange
        const payload = {
            content: "comment content",
            owner: "user-123",
        };

        //Action and assert
        expect(() => new NewComment(payload)).toThrowError("NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw an error when payload did not meet the data type specification", () => {
        //Arrage
        const payload = {
            content: 1234,
            owner: "user-123",
            threadId: "thread-123",
        };

        //Action and assert
        expect(() => new NewComment(payload)).toThrowError("NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should create AddedComment object correctly", () => {
        const payload = {
            content: "comment content",
            owner: "user-123",
            threadId: "thread-123",
        };

        const { threadId, content, owner } = new NewComment(payload);

        expect(threadId).toEqual(payload.threadId);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});
