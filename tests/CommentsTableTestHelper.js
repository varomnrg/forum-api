const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async addComment({ id = "comment-123", content = "content", owner = "user-123", threadId = "thread-123", date = "2021-08-08T07:22:33.555Z" }) {
        const query = {
            text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)",
            values: [id, content, owner, threadId, date, 0],
        };
        await pool.query(query);
    },

    async findCommentsById(id) {
        const query = {
            text: "SELECT * FROM comments WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows[0];
    },

    async cleanTable() {
        await pool.query("DELETE FROM comments WHERE 1=1");
    },
};

module.exports = CommentsTableTestHelper;
