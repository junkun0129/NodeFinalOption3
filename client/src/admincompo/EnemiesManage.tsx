import * as React from 'react';
import { Component } from 'react';
import { useState, useEffect } from 'react';

type type = {
    _id:string,
    name:string,
    hp:number,
    at:number,
    exp:number
}
function EnemiesManage() {

    const [allEnemies, setAllEnemies] = useState<Array<type>>([])

    const [name, setName] = useState("");
    const [hp, setHp] = useState("");
    const [at, setAt] = useState("");
    const [exp, setExp] = useState("");
    useEffect(()=>{
        fetch("http://localhost:8080/enemy/views",{
            method:"GET",
            headers: {"Content-Type":"application/json"}
        }).then(async res=>{
            const data:Array<type> = await res.json()
           console.log(data)
            data.forEach(enemy => {

                const newEnemy = {_id:enemy._id, name:enemy.name,hp:enemy.hp, at:enemy.at, exp:enemy.exp}
                setAllEnemies(pre=>[
                    ...pre,newEnemy
                ])
            });
            
        })
    },[])

    const deleteEnemy=(en:string, e:React.SyntheticEvent)=>{
        console.log(en)
        e.preventDefault()
        fetch("http://localhost:8080/enemy/delete",{
            method:"POST",
            body:JSON.stringify({en}),
            headers:{"Content-Type":"application/json"}
        }).then(async res=>{
            const data = await res.json()
            console.log(data)
        })
    }

    const addEnemy=(e:React.SyntheticEvent)=>{
        e.preventDefault();

        const hpI = +hp
        const atI = +at
        const expI = +exp
        
        fetch("http://localhost:8080/enemy/add",{
            method:"POST",
            body:JSON.stringify({name, hpI, atI, expI}),
            headers:{"Content-Type":"application/json"}
        }).then(async res=>{
            const data = await res.json()
            console.log(data, "added")
        })
    }

    return ( 
        <><div style={{backgroundColor:"skyblue"}}>

            <h1>enemiesmanage</h1>
            <div style={{display:"flex", justifyContent:"space-around"}}>

                <div style={{display:"flex", flexDirection:"column",width:700, height:500, backgroundColor:"white", overflow:"scroll", position:"relative"}}>
                    {allEnemies?.map((en,i)=>{
                        return <div style={{display:"flex", justifyContent:"space-around", alignItems:"start"}}>
                            <button onClick={(e)=>{deleteEnemy(en.name, e)}} style={{display:"flex", justifyContent:"center", alignContent:"center"}}>delete</button>
                            <h2>name:{en.name}</h2>
                            <h2>HP:{en.hp}</h2>
                            <h2>At:{en.at}</h2>
                            <h2>At:{en.exp}</h2>
                            
                            </div>
                    })}
                </div>

                <div style={{}}>
                    <h1>add</h1>
                    <form onSubmit={addEnemy} style={{display:"flex", flexDirection:"column"}}>
                        <input 
                            type="text" 
                            name='name'
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />name
                        <input 
                            type="text" 
                            name='hp'
                            value={hp}
                            onChange={(e)=>setHp(e.target.value)}
                        />hp
                        <input 
                            type="text" 
                            name='at'
                            value={at}
                            onChange={(e)=>setAt(e.target.value)}
                        />at
                        <input 
                            type="text" 
                            name='exp'
                            value={exp}
                            onChange={(e)=>setExp(e.target.value)}
                        />exp
                        <button type='submit'>add</button>
                    </form>
                </div>
            </div>
        </div>
        </>
     );
}

export default EnemiesManage;