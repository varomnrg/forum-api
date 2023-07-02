const pool = require("../../database/postgres/pool");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");

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
            const result = await replyRepositoryPostgres.addReply(newReply);

            // Assert
            const replies = await RepliesTableTestHelper.findReplyById("reply-123");

            expect(replies.id).toEqual("reply-123");
            expect(replies.content).toEqual("reply");
            expect(replies.owner).toEqual("user-123");
            expect(replies.comment_id).toEqual("comment-123");
            expect(replies.thread_id).toEqual("thread-123");

            expect(result).toStrictEqual(
                new AddedReply({
                    id: "reply-123",
                    content: newReply.content,
                    owner: newReply.owner,
                })
            );
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
            expect(reply.thread_id).toEqual("thread-123");
            expect(reply.comment_id).toEqual("comment-123");
            expect(reply.date).toEqual(expect.any(String));
            expect(reply.is_delete).toEqual(false);
        });

        it("should throw NotFoundError when reply not found", async () => {
            // Arrange
            const fakeIdGenerator = () => "123";
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(replyRepositoryPostgres.getReplyById("reply-123")).rejects.toThrowError("Reply tidak ditemukan");
        });
    });

    describe("getRepliesByThreadId function", () => {
        it("should return replies correctly", async () => {
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
            const replies = await replyRepositoryPostgres.getRepliesByThreadId("thread-123");

            // Assert
            expect(replies).toHaveLength(1);
            expect(replies[0].id).toEqual("reply-123");
            expect(replies[0].content).toEqual("reply");
            expect(replies[0].username).toEqual("varo");
            expect(replies[0].comment_id).toEqual("comment-123");
            expect(replies[0].date).toEqual(expect.any(String));
            expect(replies[0].is_delete).toEqual(false);
        });
    });

    describe("deleteReply function", () => {
        it("should delete reply and update is_delete", async () => {
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
            await replyRepositoryPostgres.deleteReply("reply-123");

            // Assert
            const replies = await RepliesTableTestHelper.findReplyById("reply-123");

            expect(replies.is_delete).toEqual(true);
        });

        it("should throw NotFoundError when reply not found", async () => {
            // Arrange
            const fakeIdGenerator = () => "123";
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(replyRepositoryPostgres.deleteReply("reply-123")).rejects.toThrowError("Reply tidak ditemukan");
        });
    });

    describe("verifyReplyAccess", () => {
        it("should throw NotFoundError when reply not found", async () => {
            // Arrange
            const fakeIdGenerator = () => "123";
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(replyRepositoryPostgres.verifyReplyAccess("reply-123", "user-123")).rejects.toThrowError("Reply tidak ditemukan");
        });

        it("should throw AuthorizationError when reply owner not match", async () => {
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

            // Action & Assert
            await expect(replyRepositoryPostgres.verifyReplyAccess("reply-123", "user-321")).rejects.toThrowError("Anda tidak berhak mengakses resource ini");
        });

        it("should not throw AuthorizationError when reply owner match", async () => {
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

            // Action & Assert
            await expect(replyRepositoryPostgres.verifyReplyAccess("reply-123", "user-123")).resolves.not.toThrowError("Anda tidak berhak mengakses resource ini");
        });
    });
});
