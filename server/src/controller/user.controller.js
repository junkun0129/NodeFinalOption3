const {
    userSave
} = require("../middlewares/user.middleware")

const saveUserController = async(req, res, next)=>{
    const saved = await userSave(req.body)

    return res.json(saved)
}

module.exports = {
    saveUserController,
}