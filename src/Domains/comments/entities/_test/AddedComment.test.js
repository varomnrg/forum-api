const AddedComment = require("../AddedComment");

describe("a AddedComment entitties", () => {
    it("should throw an error when payload did not contain needed property", () => {
        //Arrange
        const payload = {
            id: "comment-123",
            content: "content",
        };

        //Action and assert
        expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw an error when payload did not meet the data type specification", () => {
        //Arrage
        const payload = {
            id: 123,
            content: "content",
            owner: "user-123",
        };

        //Action and assert
        expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should create AddedComment object correctly", () => {
        const payload = {
            id: "comment-123",
            content: "content",
            owner: "user-123",
        };

        const { id, content, owner } = new AddedComment(payload);

        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});
