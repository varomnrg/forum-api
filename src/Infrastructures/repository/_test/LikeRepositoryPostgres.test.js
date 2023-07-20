const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("LikeRepositoryPostgres interface", () => {
    afterEach(async () => {
        await LikesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addLike function", () => {
        it("should persist new like and return added like correctly", async () => {
            //arrange
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
            const newLike = {
                threadId: "thread-123",
                commentId: "comment-123",
                owner: "user-123",
            };

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            //action
            const likeOutput = await likeRepositoryPostgres.addLike(newLike);

            //assert
            const likes = await LikesTableTestHelper.findLikesById("like-123");
            expect(likes.thread_id).toEqual("thread-123");
            expect(likes.comment_id).toEqual("comment-123");
            expect(likes.owner).toEqual("user-123");

            expect(likeOutput).toEqual("like-123");
        });
    });

    describe("removeLike function", () => {
        it("should delete like correctly", async () => {
            //arrange
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
            const likePayload = {
                threadId: "thread-123",
                commentId: "comment-123",
                owner: "user-123",
            };
            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLike({});

            //action
            const likeOutput = await likeRepositoryPostgres.removeLike(likePayload);

            //assert
            const likes = await LikesTableTestHelper.findLikesById("like-123");
            expect(likes).toEqual(undefined);
        });
    });

    describe("checkLike function", () => {
        it("should return true if like exist", async () => {
            //arrange
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
            const likePayload = {
                threadId: "thread-123",
                commentId: "comment-123",
                owner: "user-123",
            };

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLike({});

            //action
            const likeOutput = await likeRepositoryPostgres.checkLike(likePayload);

            //assert
            expect(likeOutput).toEqual(true);
        });

        it("should return false if like exist", async () => {
            //arrange
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
            const likePayload = {
                threadId: "thread-123",
                commentId: "comment-123",
                owner: "user-123",
            };

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            //action
            const likeOutput = await likeRepositoryPostgres.checkLike(likePayload);

            //assert
            expect(likeOutput).toEqual(false);
        });
    });

    describe("getLikesByThreadId function", () => {
        it("should return likes by thread id", async () => {
            //arrange
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLike({});
            await LikesTableTestHelper.addLike({ id: "like-124" });
            await LikesTableTestHelper.addLike({ id: "like-125" });

            //action
            const likeOutput = await likeRepositoryPostgres.getLikesByThreadId("thread-123");

            //assert
            expect(likeOutput.length).toEqual(3);
        });
    });
});
