const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");

describe("GetThreadDetailUseCase", () => {
    it("should orchestrating the get thread detail action correctly", async () => {
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
                owner: "user-123",
                threadId: "thread-123",
                is_delete: true,
            },
            {
                id: "comment-124",
                username: "user",
                date: "date",
                content: "comment",
                owner: "user-123",
                threadId: "thread-123",
                is_delete: false,
            },
        ];

        const mockLikes = [
            {
                id: "like-123",
                threadId: "thread-123",
                comment_id: "comment-124",
                owner: "user-123",
            },
            {
                id: "like-124",
                threadId: "thread-123",
                comment_id: "comment-124",
                owner: "user-124",
            },
            {
                id: "like-125",
                threadId: "thread-123",
                comment_id: "comment-123",
                owner: "user-125",
            },
        ];

        const mockReplies = [
            {
                id: "reply-BErOXUSefjwWGW1Z10Ihk",
                comment_id: "comment-124",
                content: "testing",
                date: "2021-08-08T07:59:48.766Z",
                username: "johndoe",
                is_delete: true,
            },
            {
                id: "reply-xNBtm9HPR-492AeiimpfN",
                comment_id: "comment-124",
                content: "sebuah balasan",
                date: "2021-08-08T08:07:01.522Z",
                username: "dicoding",
                is_delete: false,
            },
        ];

        const expectedThreadDetail = new DetailThread({
            id: mockThreadDetail.id,
            title: mockThreadDetail.title,
            body: mockThreadDetail.body,
            date: mockThreadDetail.date,
            username: mockThreadDetail.username,
            comments: [
                {
                    id: mockComment[0].id,
                    username: mockComment[0].username,
                    date: mockComment[0].date,
                    content: "**komentar telah dihapus**",
                    replies: [],
                    likeCount: 1,
                },
                {
                    id: mockComment[1].id,
                    username: mockComment[1].username,
                    date: mockComment[1].date,
                    content: mockComment[1].content,
                    replies: [
                        {
                            id: mockReplies[0].id,
                            username: mockReplies[0].username,
                            date: mockReplies[0].date,
                            content: "**balasan telah dihapus**",
                        },
                        {
                            id: mockReplies[1].id,
                            username: mockReplies[1].username,
                            date: mockReplies[1].date,
                            content: mockReplies[1].content,
                        },
                    ],
                    likeCount: 2,
                },
            ],
        });

        // Calling the use case
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();
        const mockLikeRepository = new LikeRepository();

        // Mock Functions
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThreadDetail));
        mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockComment));
        mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockReplies));
        mockLikeRepository.getLikesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockLikes));

        // Creating use case instance
        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
            likeRepository: mockLikeRepository,
        });

        // Action
        const threadDetail = getThreadDetailUseCase.execute(threadId);

        // Assert
        await expect(threadDetail).resolves.toStrictEqual(expectedThreadDetail);

        expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
        expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);
    });
});
