const User =require("../model/User")
const Status = require("../model/UserStatus")


const userSave = async({name,level,at, exp, hp})=>{
    const user = await User.find({name}).populate(
        "status"
    )

    await user.override({
        status:{
            level,
            exp,
            hp,
            at
        }
    })

    return await user.save()



}