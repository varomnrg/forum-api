const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addThread function", () => {
        it("should persist new thread and return added thread correctly", async () => {
            // Arrange
            const newThread = new NewThread({
                title: "title",
                body: "body",
                owner: "user-123",
            });

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });

            const fakeIdGenerator = () => "123"; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(newThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
            expect(threads).toHaveLength(1);

            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: "thread-123",
                    title: "title",
                    owner: "user-123",
                })
            );
        });
    });

    describe("getThreadById function", () => {
        it("should return thread correctly", async () => {
            // Arrange
            const newThread = new NewThread({
                title: "title",
                body: "body",
                owner: "user-123",
            });

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });

            const fakeIdGenerator = () => "123"; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await threadRepositoryPostgres.addThread(newThread);

            // Action
            const thread = await threadRepositoryPostgres.getThreadById("thread-123");

            // Assert
            expect(thread).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    title: expect.any(String),
                    body: expect.any(String),
                    username: expect.any(String),
                    date: expect.any(String),
                })
            );
        });

        it("should return error if thread not exist", async () => {
            // Arrange
            const fakeIdGenerator = () => "123"; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(threadRepositoryPostgres.getThreadById("thread-123")).rejects.toThrow(NotFoundError);
        });
    });

    describe("isThreadExist function", () => {
        it("should return true if thread exist", async () => {
            // Arrange
            const newThread = new NewThread({
                title: "title",
                body: "body",
                owner: "user-123",
            });

            await UsersTableTestHelper.addUser({ id: "user-123", username: "varo" });

            const fakeIdGenerator = () => "123"; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await threadRepositoryPostgres.addThread(newThread);

            // Action
            const isThreadExist = await threadRepositoryPostgres.isThreadExist("thread-123");

            // Assert
            expect(isThreadExist).toEqual(true);
        });

        it("should return error if thread not exist", async () => {
            // Arrange
            const fakeIdGenerator = () => "123"; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(threadRepositoryPostgres.isThreadExist("thread-123")).rejects.toThrow(NotFoundError);
        });
    });
});
