const { Router } = require("express")
const { activateDoctorStatus } = require("../controller/activateDoctorAccountController")
const { authorizationMiddlewareForRole3 } = require('../middleware/authorizationMiddleware')

const actDoctorRouter = Router()

actDoctorRouter.put("/activateDoctor/:dok_id", authorizationMiddlewareForRole3, activateDoctorStatus)


module.exports = actDoctorRouter