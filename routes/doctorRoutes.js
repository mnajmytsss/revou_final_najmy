const { Router } = require("express")
const { registerDoctor, getAllDoctors, getDoctorById, updateDoctor } = require("../controller/doctorController")
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const doctorRouter = Router()

doctorRouter.post("/register", registerDoctor)
doctorRouter.get("/getAll", authenticationMiddleware, getAllDoctors)
doctorRouter.get("/getById/:dok_id",authenticationMiddleware, getDoctorById)
doctorRouter.put("/update/:dok_id", authenticationMiddleware, updateDoctor)

module.exports = doctorRouter