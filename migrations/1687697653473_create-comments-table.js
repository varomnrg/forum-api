/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("comments", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        content: {
            type: "TEXT",
            notNull: true,
        },
        owner: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "users",
            onDelete: "cascade",
        },
        thread_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "threads",
            onDelete: "cascade",
        },
        date: {
            type: "timestamp",
            notNull: true,
        },
        is_delete: {
            type: "boolean",
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("comments");
};

