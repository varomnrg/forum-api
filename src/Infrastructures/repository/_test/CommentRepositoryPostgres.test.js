const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("CommentRepository postgres", () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addComment function", () => {
        it("should persist new comment and return added comment correctly", async () => {
            // Arrange
            const fakeIdGenerator = () => "123"; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const newComment = new NewComment({
                content: "content",
                owner: "user-123",
                threadId: "thread-123",
            });

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});

            // Action
            await commentRepositoryPostgres.addComment(newComment);

            // Assert
            const comments = await CommentsTableTestHelper.findCommentsById("comment-123");
            expect(comments).toEqual(expect.any(Object));
        });
    });

    describe("deleteComment function", () => {
        it("should delete comment correctly", async () => {
            // Arrange
            const fakeIdGenerator = () => "123"; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            // Action
            await commentRepositoryPostgres.deleteComment("comment-123");

            // Assert
            const comments = await CommentsTableTestHelper.findCommentsById("comment-123");
            expect(comments.is_delete).toEqual(true);
        });
    });

    describe("verifyCommentAccess function", () => {
        beforeAll(async () => {
            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
        });

        afterAll(async () => {
            await UsersTableTestHelper.cleanTable();
            await ThreadsTableTestHelper.cleanTable();
            await CommentsTableTestHelper.cleanTable();
        });

        it("should throw error when comment not owned by user", async () => {
            // Arrange
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentAccess("comment-123", "user-321")).rejects.toThrowError("Anda tidak berhak mengakses resource ini");
        });
    });

    describe("getCommentById function", () => {
        it("should return comment correctly", async () => {
            // Arrange
            const fakeIdGenerator = () => "123"; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            // Action
            const comment = await commentRepositoryPostgres.getCommentById("comment-123");

            // Assert
            expect(comment.id).toEqual("comment-123");
            expect(comment.content).toEqual("content");
        });

        it("should throw NotFoundError when comment not found", async () => {
            // Arrange
            const fakeIdGenerator = () => "123"; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});

            // Action & Assert
            await expect(commentRepositoryPostgres.getCommentById("comment-123")).rejects.toThrowError("Comment tidak ditemukan");
        });
    });

    describe("getCommentsByThreadId function", () => {
        it("should return comments correctly", async () => {
            // Arrange
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await CommentsTableTestHelper.addComment({ id: "comment-321", thread_id: "thread-123" });

            // Action
            const comments = await commentRepositoryPostgres.getCommentsByThreadId("thread-123");

            // Assert
            expect(comments).toHaveLength(2);
        });
    });
});
