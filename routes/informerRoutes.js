const { Router } = require("express")
const { registerInformer, getAllInformer, getInformerById, updateInformer } = require("../controller/informerController")
const { authorizationMiddlewareForRole1 , authorizationMiddlewareForRole2, authorizationMiddlewareForRole3} = require('../middleware/authorizationMiddleware')

const informerRouter = Router()

informerRouter.post("/register", authorizationMiddlewareForRole1, registerInformer)
informerRouter.get("/getAll", getAllInformer)
informerRouter.get("/getById/:inf_id", getInformerById)
informerRouter.put("/update/:inf_id", authorizationMiddlewareForRole1, updateInformer)

module.exports = informerRouter