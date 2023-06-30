const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("GetThreadDetailUseCase", () => {
    it("should orchestrating the get thread detail action correctly", () => {
        //Arrange
        const threadId = "thread-123";

        const mockThreadDetail = new DetailThread({
            id: threadId,
            title: "title",
            body: "body",
            date: "date",
            username: "user",
            comments: [],
        });

        const mockComment = [
            {
                id: "comment-123",
                username: "user",
                date: "date",
                content: "comment",
            },
            {
                id: "comment-124",
                username: "user",
                date: "date",
                content: "comment",
            },
        ];

        // Calling the use case
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        // Mock Functions
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThreadDetail));
        mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockComment));
        mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve([]));

        // Creating use case instance
        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const threadDetail = getThreadDetailUseCase.execute(threadId);
        // Assert
        expect(threadDetail).resolves.toStrictEqual(
            new DetailThread({
                id: "thread-123",
                title: "title",
                body: "body",
                date: "date",
                username: "user",
                comments: [
                    {
                        id: "comment-123",
                        username: "user",
                        date: "date",
                        content: "comment",
                        replies: [],
                    },
                    {
                        id: "comment-124",
                        username: "user",
                        date: "date",
                        content: "comment",
                        replies: [],
                    },
                ],
            })
        );

        expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    });
});
