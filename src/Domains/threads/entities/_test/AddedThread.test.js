const AddedThread = require("../AddedThread");

describe("a AddedThread entitties", () => {
    it("should throw an error when payload did not contain needed property", () => {
        //Arrange
        const payload = {
            id: "thread-145678",
            title: "titlt",
        };

        //Action and assert
        expect(() => new AddedThread(payload)).toThrowError("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw an error when payload did not meet the data type specification", () => {
        //Arrage
        const payload = {
            id: 1123,
            title: "title",
            owner: "user-123",
        };

        //Action and assert
        expect(() => new AddedThread(payload)).toThrowError("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should create AddedThread object correctly", () => {
        const payload = {
            id: "thread-123",
            title: "title",
            owner: "user-123",
        };

        const { id, title, owner } = new AddedThread(payload);

        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(owner).toEqual(payload.owner);
    });
});
