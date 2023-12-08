const { Router } = require("express")
const { registerDoctor, getAllDoctors, getDoctorById, updateDoctor } = require("../controller/doctorController")
const { authorizationMiddlewareForRole2 } = require('../middleware/authorizationMiddleware')

const doctorRouter = Router()

doctorRouter.post("/register", authorizationMiddlewareForRole2, registerDoctor)
doctorRouter.get("/getAllDoctors", getAllDoctors)
doctorRouter.get("/getDoctorById/:dok_id", getDoctorById)
doctorRouter.put("/updateDoctor/:dok_id", updateDoctor)

module.exports = doctorRouter