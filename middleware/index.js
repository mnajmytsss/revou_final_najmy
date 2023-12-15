const corsMiddleware = require("./corsMiddleware");
const helmetMiddleware = require("./helmetMiddleware");
const morganMiddleware = require("./morganMiddleware");
const requestMiddleware = require("./requestMiddleware");
const bodyParserMiddleware = require("./bodyParserMiddleware")
const databaseMiddleware = require("./databaseMiddleware")
const passport = require("./passportMiddleware");

const useMiddleware = (app) => {
    app.use(requestMiddleware);
    helmetMiddleware(app);
    bodyParserMiddleware(app);
    corsMiddleware(app);
    morganMiddleware(app);
    databaseMiddleware(app);
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = useMiddleware;