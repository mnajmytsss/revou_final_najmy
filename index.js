const express = require('express')
const dotenv = require ('dotenv')
const router = require('./routes');
const useMiddleware = require('./middleware');

const app = express()
dotenv.config()

useMiddleware(app)

app.use(router)

const server_port = (process.env.SERVER_PORT) 

app.listen(server_port, () => {
    console.log(`Running on port http://localhost:${server_port}`);
   })