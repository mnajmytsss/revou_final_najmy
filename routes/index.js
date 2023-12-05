const { Router } = require("express");
const dashboardRoutes = require("./dashboardRoutes");
const preventAttackController = require("./preventAttackRoutes");
const authRouter = require('./authRoutes')

const router = Router();

router.use("/", dashboardRoutes);
router.use("/api/v1/attack", preventAttackController)
router.use("/auth", authRouter)

module.exports = router;