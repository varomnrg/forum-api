const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
    translate(error) {
        return DomainErrorTranslator._directories[error.message] || error;
    },
};

DomainErrorTranslator._directories = {
    "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"),
    "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat membuat user baru karena tipe data tidak sesuai"),
    "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError("tidak dapat membuat user baru karena karakter username melebihi batas limit"),
    "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError("tidak dapat membuat user baru karena username mengandung karakter terlarang"),
    "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("harus mengirimkan username dan password"),
    "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("username dan password harus string"),
    "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN": new InvariantError("harus mengirimkan token refresh"),
    "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("refresh token harus string"),
    "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN": new InvariantError("harus mengirimkan token refresh"),
    "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("refresh token harus string"),
    "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("gagal memasukan, harus memberikan judul dan isi"),
    "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("title dan body harus string"),
    "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("gagal memasukan, harus memberikan isi komentar, pemilik komentar, dan id thread"),
    "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("content, owner, dan threadId harus string"),
    "DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("harus mengirimkan threadId, commentId, dan owner"),
    "DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("threadId, commentId, dan owner harus string"),
    "DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("harus mengirimkan threadId, commentId, replyId, dan owner"),
    "DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("threadId, commentId, replyId, dan owner harus string"),
};

module.exports = DomainErrorTranslator;

