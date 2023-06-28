const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment) {
        const { content, owner, threadId } = newComment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
            values: [id, content, owner, threadId, date, 0],
        };

        const result = await this._pool.query(query);

        return new AddedComment({ ...result.rows[0] });
    }

    async deleteComment(id) {
        const query = {
            text: "UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Comment tidak ditemukan");
        }
    }

    async getCommentById(id) {
        const query = {
            text: "SELECT * FROM comments WHERE id = $1",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Comment tidak ditemukan");
        }

        return result.rows[0];
    }

    async verifyCommentAccess(commentId, ownerId) {
        const result = await this.getCommentById(commentId);

        const comment = result;

        if (comment.owner !== ownerId) {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
        }
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: "SELECT comments.*, users.username FROM comments INNER JOIN users ON comments.owner = users.id WHERE comments.thread_id = $1",
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async isCommentExist(commentId) {
        await this.getCommentById(commentId);

        return true;
    }
}

module.exports = CommentRepositoryPostgres;
