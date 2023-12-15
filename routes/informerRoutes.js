const { Router } = require("express")
const { registerInformer, getAllInformer, getInformerById, updateInformer } = require("../controller/informerController")
const { authorizationMiddlewareForRole1} = require('../middleware/authorizationMiddleware')
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const informerRouter = Router()

informerRouter.post("/register", registerInformer)
informerRouter.get("/getAll", getAllInformer)
informerRouter.get("/getById/:inf_id", getInformerById)
informerRouter.put("/update/:inf_id", authorizationMiddlewareForRole1, authenticationMiddleware, updateInformer)

module.exports = informerRouter