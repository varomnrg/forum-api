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
});
