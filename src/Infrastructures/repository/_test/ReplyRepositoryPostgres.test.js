const pool = require("../../database/postgres/pool");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepositoryPostgres interface", () => {
    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addReply function", () => {
        it("should persist new reply and return added reply correctly", async () => {
            // Arrange
            const newReply = {
                content: "reply",
                owner: "user-123",
                commentId: "comment-123",
                threadId: "thread-123",
            };

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => "123";
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await replyRepositoryPostgres.addReply(newReply);

            // Assert
            const replies = await RepliesTableTestHelper.findReplyById("reply-123");
            expect(replies).toBeDefined();
        });
    });

    describe("getReplyById function", () => {
        it("should return reply correctly", async () => {
            // Arrange
            const newReply = {
                content: "reply",
                owner: "user-123",
                commentId: "comment-123",
                threadId: "thread-123",
            };

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => "123";
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            await replyRepositoryPostgres.addReply(newReply);

            // Action
            const reply = await replyRepositoryPostgres.getReplyById("reply-123");

            // Assert
            expect(reply.id).toEqual("reply-123");
            expect(reply.content).toEqual("reply");
            expect(reply.owner).toEqual("user-123");
            expect(reply.comment_id).toEqual("comment-123");
        });
    });
});
