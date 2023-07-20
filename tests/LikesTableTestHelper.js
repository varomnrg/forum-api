const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesTableTestHelper = {
    async addLike({ id = "like-123", threadId = "thread-123", commentId = "comment-123", owner = "user-123" }) {
        const query = {
            text: "INSERT INTO likes VALUES($1, $2, $3, $4)",
            values: [id, threadId, commentId, owner],
        };

        await pool.query(query);
    },

    async findLikesById(id) {
        const query = {
            text: "SELECT * FROM likes WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);

        return result.rows[0];
    },

    async cleanTable() {
        await pool.query("DELETE FROM likes WHERE 1=1");
    },
};

module.exports = LikesTableTestHelper;
