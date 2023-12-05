const db = require("../db")

const databaseMiddleware = (req, res, next) => {
    req.db = db;
    (next)
}

module.exports = databaseMiddleware