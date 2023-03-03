const Enemy = require("../model/Enemy")

const enemyFetch = async()=>{
    let allenemy = await Enemy.find();
    let randomNum = Math.floor(Math.random()*allenemy.length)
    
    return allenemy[randomNum]
}

const enemyFetchAll = async()=>{
    let allenemy = await Enemy.find();
    return allenemy
}

const enemyDelete = async(name)=>{
    console.log(name, "this is name")
    let deleete = await Enemy.deleteOne({name})
    return deleete
}

const enemyAdd = async({name,hpI,atI, expI})=>{
    const added = await new Enemy({
        name,
        hp:hpI,
        at:atI,
        exp:expI
    })
    const saved = await added.save()
    return saved

}

module.exports = {
    enemyFetch,
    enemyFetchAll,
    enemyDelete,
    enemyAdd
}