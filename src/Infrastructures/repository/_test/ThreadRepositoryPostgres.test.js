const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

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
            await threadRepositoryPostgres.addThread(newThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
            expect(threads).toHaveLength(1);
        });

        it("should return added thread correctly", async () => {
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
            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: "thread-123",
                    title: "title",
                    owner: "user-123",
                })
            );
        });
    });
});
