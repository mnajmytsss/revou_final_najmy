const { Router } = require("express");
const dashboardRoutes = require("./dashboardRoutes");
const preventAttackController = require("./preventAttackRoutes");
const authRouter = require('./authRoutes')
const doctorRouter = require('./doctorRoutes')
const authenticationMiddleware = require('../middleware/authenticationMiddleware')

const router = Router();

router.use("/", dashboardRoutes);
router.use("/api/v1/attack", preventAttackController)
router.use("/auth", authRouter)
router.use("/api/v1/doctor", authenticationMiddleware, doctorRouter)

module.exports = router;