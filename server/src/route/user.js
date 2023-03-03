const router = require("express").Router();
const controller = reqire("../controller/user.controller")
router.post(("/save"),controller.saveUserController)
