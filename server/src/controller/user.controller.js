const {
    userSave
} = require("../middlewares/user.middleware")

const saveUserController = async(req, res, next)=>{
    console.log(req.body)
    const saved = await userSave(req.body)
    console.log("kitade")
    return res.json(saved)
}

module.exports = {
    saveUserController,
}