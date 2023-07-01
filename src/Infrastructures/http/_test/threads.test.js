const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("/threads endpoint", () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
    });

    describe("when POST /threads", () => {
        it("should response 201 and make a new thread", async () => {
            // Arrange
            const requestPayload = {
                title: "title",
                body: "body",
            };
            const authPayload = {
                username: "dicoding",
                password: "secret",
            };

            const server = await createServer(container);

            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "dicoding",
                    password: "secret",
                    fullname: "Dicoding Indonesia",
                },
            });

            const responseAuth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: authPayload,
            });

            // Action
            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it("should response 400 when payload does not contain needed property", async () => {
            // Arrange
            const requestPayload = {
                title: "Test",
            };

            const authPayload = {
                username: "dicoding",
                password: "secret",
            };

            const server = await createServer(container);
            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "dicoding",
                    password: "secret",
                    fullname: "Dicoding Indonesia",
                },
            });

            const responseAuth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: authPayload,
            });

            // Action
            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("gagal memasukan, harus memberikan judul dan isi");
        });

        it("should response 401 when request authentication not contain access token", async () => {
            // Arrange
            const requestPayload = {
                title: "Test",
                body: "Test",
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual("Missing authentication");
        });
    });

    describe("when GET /threads/{threadId}", () => {
        it("should response 200 and return the thread details", async () => {
            // Arrange
            const authPayload = {
                username: "dicoding",
                password: "secret",
            };

            const server = await createServer(container);
            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "dicoding",
                    password: "secret",
                    fullname: "Dicoding Indonesia",
                },
            });

            const responseAuth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: authPayload,
            });

            const threadResponse = await server.inject({
                method: "POST",
                url: "/threads",
                payload: {
                    title: "title",
                    body: "body",
                },
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            await server.inject({
                method: "POST",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments`,
                payload: {
                    content: "comment1",
                },
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            await server.inject({
                method: "POST",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments`,
                payload: {
                    content: "comment2",
                },
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Action

            const response = await server.inject({
                method: "GET",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread.comments).toBeDefined();
            expect(responseJson.data.thread.comments).toHaveLength(2);
        });

        it("should response 404 when thread is not found", async () => {
            // Arrange
            const authPayload = {
                username: "dicoding",
                password: "secret",
            };

            const server = await createServer(container);
            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "dicoding",
                    password: "secret",
                    fullname: "Dicoding Indonesia",
                },
            });

            const responseAuth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: authPayload,
            });

            const threadResponse = await server.inject({
                method: "POST",
                url: "/threads",
                payload: {
                    title: "title",
                    body: "body",
                },
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            await server.inject({
                method: "POST",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments`,
                payload: {
                    content: "comment1",
                },
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            await server.inject({
                method: "POST",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments`,
                payload: {
                    content: "comment2",
                },
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Action

            const response = await server.inject({
                method: "GET",
                url: `/threads/fake${JSON.parse(threadResponse.payload).data.addedThread.id}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("Thread tidak ditemukan");
        });
    });
});
