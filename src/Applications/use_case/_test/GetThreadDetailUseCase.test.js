const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const ThreadDetail = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("GetThreadDetailUseCase", () => {
    it("should orchestrating the get thread detail action correctly", () => {
        //Arrange
        const threadId = "thread-123";

        const mockThreadDetail = new ThreadDetail({
            id: threadId,
            title: "title",
            body: "body",
            date: "date",
            username: "user",
            comments: [],
        });

        // Calling the use case
        const mockThreadRepository = new ThreadRepository();

        // Mock Functions
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThreadDetail));

        // Creating use case instance
        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const threadDetail = getThreadDetailUseCase.execute(threadId);

        // Assert
        expect(threadDetail).resolves.toStrictEqual(
            new ThreadDetail({
                id: "thread-123",
                title: "title",
                body: "body",
                date: "date",
                username: "user",
                comments: [],
            })
        );

        expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    });
});
