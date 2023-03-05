const {
  enemyFetch,
  enemyFetchAll,
  enemyDelete,
  enemyAdd,
} = require("../middlewares/enemy.middleware");

const createEnemyController = async (req, res, next) => {
  const enemy1 = await enemyFetch();
  const enemy2 = await enemyFetch();
  const enemy3 = await enemyFetch();
  const enemies = [enemy1, enemy2, enemy3];
  return res.json(enemies);
};

const viewAllEnemiesController = async (req, res, next) => {
  const enemies = await enemyFetchAll();
  // console.log(enemies)
  return res.json(enemies);
};

const deleteEnemyController = async (req, res, next) => {
  const { en } = await req.body;
  console.log(en, "this is ");
  const deleted = await enemyDelete(en);

  return res.json(deleted);
};

const addEnemyCOntroller = async (req, res, next) => {
  const { name, hp, at, exp } = await req.body;
  console.log(req.body);
  const added = await enemyAdd(req.body);
  console.log(added);
  return res.json(added);
};

module.exports = {
  createEnemyController,
  viewAllEnemiesController,
  deleteEnemyController,
  addEnemyCOntroller,
};
