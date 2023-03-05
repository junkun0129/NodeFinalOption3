const User = require("../model/User");
const Status = require("../model/UserStatus");

const userSave = async ({ name, level, at, exp, hp }) => {
  console.log(name);
  const user = await User.findOne({ name });

  const status = await Status.findOne({ _id: user.status });

  console.log(status, ";lkj");

  await status.overwrite({
    level,
    exp,
    hp,
    maxmumHp: hp,
    at,
  });

  await console.log(status, "saved user");

  return await status.save();
};

module.exports = {
  userSave,
};
