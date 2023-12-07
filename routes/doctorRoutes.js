const { Router } = require("express")
const { registerDoctor, getAllDoctors } = require("../controller/doctorController")
const { authorizationMiddlewareForRole2 } = require('../middleware/authorizationMiddleware')

const doctorRouter = Router()

doctorRouter.post("/register", authorizationMiddlewareForRole2, registerDoctor)
doctorRouter.get("/getAllDoctors", getAllDoctors)

module.exports = doctorRouter