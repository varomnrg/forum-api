/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("likes", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        thread_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "threads",
            onDelete: "cascade",
        },
        comment_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "comments",
            onDelete: "cascade",
        },
        owner: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "users",
            onDelete: "cascade",
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("likes");
};

