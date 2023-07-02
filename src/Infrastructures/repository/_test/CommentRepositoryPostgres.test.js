const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");

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
            const commentOutput = await commentRepositoryPostgres.addComment(newComment);

            // Assert
            const comments = await CommentsTableTestHelper.findCommentsById("comment-123");
            expect(comments.content).toEqual("content");
            expect(comments.owner).toEqual("user-123");
            expect(comments.thread_id).toEqual("thread-123");

            expect(commentOutput).toStrictEqual(
                new AddedComment({
                    id: "comment-123",
                    content: "content",
                    owner: "user-123",
                })
            );
        });
    });

    describe("deleteComment function", () => {
        it("should delete comment correctly", async () => {
            // Arrange
            const fakeIdGenerator = () => "123"; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await AuthenticationsTableTestHelper;
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            // Action
            await commentRepositoryPostgres.deleteComment("comment-123");

            // Assert
            const comments = await CommentsTableTestHelper.findCommentsById("comment-123");
            expect(comments.is_delete).toEqual(true);
        });
    });

    describe("getCommentById function", () => {
        it("should return comment correctly", async () => {
            // Arrange
            const fakeIdGenerator = () => "123"; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({ id: "thread-123" });
            await CommentsTableTestHelper.addComment({ id: "comment-123", content: "content", owner: "user-123", threadId: "thread-123" });

            // Action
            const comment = await commentRepositoryPostgres.getCommentById("comment-123");

            // Assert
            expect(comment.id).toEqual("comment-123");
            expect(comment.content).toEqual("content");
            expect(comment.owner).toEqual("user-123");
            expect(comment.thread_id).toEqual("thread-123");
            expect(comment.date).toEqual(expect.any(Date));
            expect(comment.is_delete).toEqual(false);
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

    describe("verifyCommentAccess function", () => {
        it("should not throw error when comment owned by user", async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentAccess("comment-123", "user-123")).resolves.not.toThrowError("Anda tidak berhak mengakses resource ini");
        });

        it("should throw error when comment not owned by user", async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentAccess("comment-123", "user-321")).rejects.toThrowError("Anda tidak berhak mengakses resource ini");
        });
    });

    describe("getCommentsByThreadId function", () => {
        it("should return comments correctly", async () => {
            // Arrange
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({ id: "comment-123", thread_id: "thread-123", content: "content", owner: "user-123" });
            await CommentsTableTestHelper.addComment({ id: "comment-321", thread_id: "thread-123", content: "content2", owner: "user-123" });

            // Action
            const comments = await commentRepositoryPostgres.getCommentsByThreadId("thread-123");

            // Assert

            comments.sort((a, b) => {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            });

            expect(comments).toHaveLength(2);

            expect(comments[0].id).toEqual("comment-123");
            expect(comments[0].content).toEqual("content");
            expect(comments[0].owner).toEqual("user-123");
            expect(comments[0].thread_id).toEqual("thread-123");
            expect(comments[0].date).toEqual(expect.any(Date));
            expect(comments[0].is_delete).toEqual(false);
            expect(comments[0].username).toEqual("varo");

            expect(comments[1].id).toEqual("comment-321");
            expect(comments[1].content).toEqual("content2");
            expect(comments[1].owner).toEqual("user-123");
            expect(comments[1].thread_id).toEqual("thread-123");
            expect(comments[1].date).toEqual(expect.any(Date));
            expect(comments[1].is_delete).toEqual(false);
            expect(comments[1].username).toEqual("varo");
        });
    });

    describe("isCommentExist function", () => {
        it("should throw NotFoundError when comment not found", async () => {
            // Arrange
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(commentRepositoryPostgres.isCommentExist("comment-123")).rejects.toThrowError("Comment tidak ditemukan");
        });

        it("should return true when comment is found", async () => {
            // Arrange
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            // Action
            const isCommentExist = await commentRepositoryPostgres.isCommentExist("comment-123");

            // Assert
            expect(isCommentExist).toEqual(true);
        });
    });
});
