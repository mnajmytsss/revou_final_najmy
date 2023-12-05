const corsMiddleware = require("./corsMiddleware");
const helmetMiddleware = require("./helmetMiddleware");
const morganMiddleware = require("./morganMiddleware");
const requestMiddleware = require("./requestMiddleware");
const bodyParserMiddleware = require("./bodyParserMiddleware")
const databaseMiddleware = require("./databaseMiddleware")

const useMiddleware = (app) => {
    app.use(requestMiddleware);
    helmetMiddleware(app);
    bodyParserMiddleware(app);
    corsMiddleware(app);
    morganMiddleware(app);
    databaseMiddleware(app);
}

module.exports = useMiddleware;