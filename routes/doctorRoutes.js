const { Router } = require("express")
const { registerDoctor } = require("../controller/doctorController")

const doctorRouter = Router()

doctorRouter.post("/register", registerDoctor)

module.exports = doctorRouter