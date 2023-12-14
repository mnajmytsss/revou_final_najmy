const { Router } = require("express");
const dashboardRoutes = require("./dashboardRoutes");
const preventAttackController = require("./preventAttackRoutes");
const authRouter = require('./authRoutes')
const doctorRouter = require('./doctorRoutes')
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const actDoctorRouter = require("./activateDoctorAccount");
const deactDoctorRouter = require("./deactivateDoctorAccount");
const informerRouter = require("./informerRoutes")
const imagesRouter = require("./uploadImagesRoutes")

const router = Router();

router.use("/", dashboardRoutes);
router.use("/api/v1/attack", preventAttackController)
router.use("/api/v1/auth", authRouter)
router.use("/api/v1/doctor", authenticationMiddleware, doctorRouter)
router.use("/api/v1/admin", authenticationMiddleware, actDoctorRouter)
router.use("/api/v1/admin", authenticationMiddleware, deactDoctorRouter)
router.use("/api/v1/informer", authenticationMiddleware, informerRouter)
router.use("/api/v1/image",authenticationMiddleware, imagesRouter)

module.exports = router;