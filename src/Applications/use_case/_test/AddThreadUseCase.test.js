const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
    it("should orchestrating the add thread action correctly", async () => {
        // Arrange
        const useCasePayload = {
            title: "thread title",
            body: "the thread body",
            owner: "user-123",
        };

        const mockAddedThread = new AddedThread({
            id: "thread-123",
            title: useCasePayload.title,
            owner: "user-123",
        });

        // Calling the use case
        const mockThreadRepository = new ThreadRepository();

        // Mock Functions
        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThread));

        // Creating use case instance
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(
            new AddedThread({
                id: "thread-123",
                title: useCasePayload.title,
                owner: "user-123",
            })
        );

        expect(mockThreadRepository.addThread).toBeCalledWith(
            new NewThread({
                title: useCasePayload.title,
                body: useCasePayload.body,
                owner: useCasePayload.owner,
            })
        );
    });
});
