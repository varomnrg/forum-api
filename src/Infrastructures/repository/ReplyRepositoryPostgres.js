const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this.pool = pool;
        this.idGenerator = idGenerator;
    }

    async addReply(newReply) {
        const { content, owner, commentId, threadId } = newReply;
        const id = `reply-${this.idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner",
            values: [id, content, owner, threadId, commentId, date, 0],
        };

        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async getReplyById(id) {
        const query = {
            text: "SELECT * FROM replies WHERE id = $1",
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Reply tidak ditemukan");
        }

        return result.rows[0];
    }

    async getRepliesByThreadId(id) {
        const query = {
            text: "SELECT replies.id, users.username, replies.date, replies.content, replies.comment_id, replies.is_delete FROM replies INNER JOIN users ON users.id = replies.owner WHERE replies.thread_id = $1",
            values: [id],
        };

        const result = await this.pool.query(query);

        return result.rows;
    }

    async deleteReply(id) {
        const query = {
            text: "UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id",
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Reply tidak ditemukan");
        }

        return result.rows[0].id;
    }

    async verifyReplyAccess(replyId, owner) {
        const result = await this.getReplyById(replyId);

        if (result.owner !== owner) {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
        }
    }
}

module.exports = ReplyRepositoryPostgres;
