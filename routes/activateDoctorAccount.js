const { Router } = require("express")
const { activateDoctorAccountController } = require("../controller/activateDoctorAccountController")
const { authorizationMiddlewareForRole3 } = require('../middleware/authorizationMiddleware')

const actDoctorRouter = Router()

actDoctorRouter.put("/activateDoctor/:dok_id", authorizationMiddlewareForRole3, activateDoctorAccountController)


module.exports = actDoctorRouter