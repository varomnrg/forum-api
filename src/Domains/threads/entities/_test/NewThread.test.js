const NewThread = require("../NewThread");

describe("a NewThread entitties", () => {
    it("should throw an error when payload did not contain needed property", () => {
        //Arrange
        const payload = {
            title: "The title",
            owner: "user-123",
        };

        //Action and assert
        expect(() => new NewThread(payload)).toThrowError("NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw an error when payload did not meet the data type specification", () => {
        //Arrage
        const payload = {
            title: 12,
            body: "body",
            owner: "user-123",
        };

        //Action and assert
        expect(() => new NewThread(payload)).toThrowError("NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should create NewThread object correctly", () => {
        const payload = {
            title: "Title",
            body: "The body",
            owner: "user-123",
        };

        const { title, body, owner } = new NewThread(payload);

        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });
});
