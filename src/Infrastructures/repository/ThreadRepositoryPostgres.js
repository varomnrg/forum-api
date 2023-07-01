const InvariantError = require("../../Commons/exceptions/InvariantError");
const NewThread = require("../../Domains/threads/entities/NewThread");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(newThread) {
        const { title, body, owner } = newThread;
        const id = `thread-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
            values: [id, title, body, owner, date],
        };

        const result = await this._pool.query(query);

        return new AddedThread({ ...result.rows[0] });
    }

    async getThreadById(id) {
        const query = {
            text: "SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads LEFT JOIN users ON threads.owner = users.id WHERE threads.id = $1",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Thread tidak ditemukan");
        }

        return result.rows[0];
    }

    async isThreadExist(id) {
        const result = await this.getThreadById(id);

        if (!result) {
            return false;
        }
        return true;
    }
}

module.exports = ThreadRepositoryPostgres;
