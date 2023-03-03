const router = require("express").Router();
const controller = require("../controller/enemy.controller")
router.get(("/create"), controller.createEnemyController)
router.get(("/views"),controller.viewAllEnemiesController)
router.post(("/delete"), controller.deleteEnemyController)
router.post(("/add"),controller.addEnemyCOntroller)

module.exports = router