/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("replies", {
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
        comment_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "comments",
            onDelete: "cascade",
        },
        date: {
            type: "TEXT",
            notNull: true,
        },
        is_delete: {
            type: "BOOLEAN",
            notNull: true,
            default: false,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("replies");
};

