const ReplyRepository = require("../../Domains/replies/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this.pool = pool;
        this.idGenerator = idGenerator;
    }

    async addReply(newReply) {
        const { content, owner, commentId } = newReply;
        const id = `reply-${this.idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
            values: [id, content, owner, commentId, date, 0],
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

    async getRepliesByThreadId() {
        throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async deleteReply() {
        throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async verifyReplyAccess() {}
}

module.exports = ReplyRepositoryPostgres;
