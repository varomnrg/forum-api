const DetailThread = require("../DetailThread");

describe("DetailThread entities", () => {
    it("should throw error when payload did not contain needed property", () => {
        // Arrange
        const payload = {
            id: "thread-123",
            title: "title",
            body: "body",
            date: "date",
            username: "username",
        };

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrowError("DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    });
    it("should throw error when payload did not meet data type specification", () => {
        // Arrange
        const payload = {
            id: "thread-123",
            title: "title",
            body: "body",
            date: "date",
            username: "username",
            comments: 123,
        };

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrowError("DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });
    it("should create DetailThread object correctly", () => {
        // Arrange
        const payload = {
            id: "thread-123",
            title: "title",
            body: "body",
            date: "date",
            username: "username",
            comments: [],
        };

        // Action
        const { id, title, body, date, username, comments } = new DetailThread(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
        expect(comments).toEqual(payload.comments);
    });
});
