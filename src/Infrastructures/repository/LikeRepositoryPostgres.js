const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addLike(payload) {
        const { threadId, commentId, owner } = payload;
        const id = `like-${this._idGenerator()}`;

        const query = {
            text: "INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id",
            values: [id, threadId, commentId, owner],
        };

        const result = await this._pool.query(query);
        return result.rows[0].id;
    }

    async removeLike(payload) {
        const { threadId, commentId, owner } = payload;

        const query = {
            text: "DELETE FROM likes WHERE thread_id = $1 AND comment_id = $2 AND owner = $3 RETURNING id",
            values: [threadId, commentId, owner],
        };

        const result = await this._pool.query(query);
        return result.rows[0].id;
    }

    async checkLike(payload) {
        const { threadId, commentId, owner } = payload;

        const query = {
            text: "SELECT * FROM likes WHERE thread_id = $1 AND comment_id = $2 AND owner = $3",
            values: [threadId, commentId, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            return false;
        }

        return true;
    }

    async getLikesByThreadId(threadId) {
        const query = {
            text: "SELECT * FROM likes WHERE thread_id = $1",
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }
}

module.exports = LikeRepositoryPostgres;
