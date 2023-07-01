const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("/comments endpoint", () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    describe("when POST /threads/{threadId}/comments", () => {
        it("should response 201 and make a new comment", async () => {
            // Arrange
            const requestPayload = {
                content: "content",
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

            // Action
            const response = await server.inject({
                method: "POST",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.addedComment).toBeDefined();
        });

        it("should response 404 if thread not exist", async () => {
            // Arrange
            const requestPayload = {
                content: "content",
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
                url: `/threads/thread123/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("Thread tidak ditemukan");
        });

        it("should response 400 if request payload not contain needed property", async () => {
            // Arrange
            const requestPayload = {
                contents: "content",
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

            // Action
            const response = await server.inject({
                method: "POST",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada");
        });
    });

    describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
        it("should response 200 and update comment", async () => {
            // Arrange
            const requestPayload = {
                content: "content",
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

            const commentResponse = await server.inject({
                method: "POST",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Action

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments/${JSON.parse(commentResponse.payload).data.addedComment.id}`,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Assert

            const responseJson = JSON.parse(response.payload);
            const comment = await CommentsTableTestHelper.findCommentsById(JSON.parse(commentResponse.payload).data.addedComment.id);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual("success");
            expect(comment.is_delete).toEqual(true);
        });

        it("should response 404 if thread not exist", async () => {
            // Arrange
            const requestPayload = {
                content: "content",
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

            const commentResponse = await server.inject({
                method: "POST",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Action

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}1/comments/${JSON.parse(commentResponse.payload).data.addedComment.id}`,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Assert

            const responseJson = JSON.parse(response.payload);
            const comment = await CommentsTableTestHelper.findCommentsById(JSON.parse(commentResponse.payload).data.addedComment.id);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("Thread tidak ditemukan");
        });

        it("should response 403 if user not the owner", async () => {
            // Arrange
            const requestPayload = {
                content: "content",
            };

            const authPayload = {
                username: "dicoding",
                password: "secret",
            };

            const authPayload2 = {
                username: "dicoding2",
                password: "secret2",
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

            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "dicoding2",
                    password: "secret2",
                    fullname: "Dicoding Indonesia2",
                },
            });

            const responseAuth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: authPayload,
            });

            const responseAuth2 = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: authPayload2,
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

            const commentResponse = await server.inject({
                method: "POST",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth.payload).data.accessToken}`,
                },
            });

            // Action

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${JSON.parse(threadResponse.payload).data.addedThread.id}/comments/${JSON.parse(commentResponse.payload).data.addedComment.id}`,
                headers: {
                    Authorization: `Bearer ${JSON.parse(responseAuth2.payload).data.accessToken}`,
                },
            });

            // Assert

            const responseJson = JSON.parse(response.payload);
            const comment = await CommentsTableTestHelper.findCommentsById(JSON.parse(commentResponse.payload).data.addedComment.id);

            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("Anda tidak berhak mengakses resource ini");
        });
    });
});
