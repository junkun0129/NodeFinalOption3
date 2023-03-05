const router = require("express").Router();
const controller = require("../controller/user.controller")
router.post(("/save"),controller.saveUserController)

module.exports = router;