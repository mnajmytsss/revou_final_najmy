const { Router } = require("express")
const { deactivateDoctorStatus } = require("../controller/deactivateDoctorAccountController")
const { authorizationMiddlewareForRole3, authorizationMiddlewareForRole2 } = require('../middleware/authorizationMiddleware')

const deactDoctorRouter = Router()

deactDoctorRouter.put("/deactivateDoctor/:dok_id", deactivateDoctorStatus)


module.exports = deactDoctorRouter