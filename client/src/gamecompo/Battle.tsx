import * as React from 'react';
import { Component } from 'react';
import styles from "./Battle.module.scss";
import {motion, MotionValue, motionValue, useAnimationControls, useMotionValue, useMotionValueEvent, useTransform} from "framer-motion"
import { socketType } from './Field';
import { useState, useEffect } from 'react';
import Genkiman from '../enemycompo/Genkiman';
import {star} from "./SvgPath"
import Hentaiyou from '../enemycompo/Hentaiyou';
import HP from '../component/HP';
import { useAppDispatch, useAppSelector } from '../store/store';
import { maketozero1,maketozero2,maketozero3,atackEnemy1, atackEnemy2, atackEnemy3, createEnemy1, createEnemy2, createEnemy3 } from '../store/features/enemySlice';
import {restoreHP,getAttackFromEnemy} from "../store/features/userStatuSlice"
import {enemyStatusType} from "../store/features/enemySlice"
import { useNonInitialEffect } from '../customhooks/useNonInitialEffect';

export type enemeyStatusType = {
    hp:number,
    at:number
}
function Battle({socket}:socketType) {
    // const [isEncount, setIsEncount] = useState<boolean>(false);
    const [enemyDragState, setEnemyDragState] = useState(0);
    // const enemy1position = 1;
    // const enemy2position = 2;
    // const enemy3position = 3

    // const [backScreen, setBackScreen] = useState(false);

    const [whichEnemyAt, setWhichEnemyAt] = useState(0)

    const battleOffScene = 0;
    const appearedScene = 1
    const yourTurnScene = 2;
    const yourActionScene =3 
    const enemiesTurnScene = 4;
    const enemiesActionScene = 5
    const afterBattleScene = 6;
    const [sceneState, setSceneState] = useState<number>(0);

    const [error, setError] = useState("");
    const appearDialog = "Enemy appeared!!"
    const yourturnDialog = "Your turn"
    const enemyDialog = "'s attack!"
    
    const createEnemyDispatch = useAppDispatch()
    const enemy1Selector = useAppSelector(state=>state.reducer.enemy1Reducer)
    const enemy2Selector = useAppSelector(state=>state.reducer.enemy2Reducer)
    const enemy3Selector = useAppSelector(state=>state.reducer.enemy3Reducer)

    const enemySelectors = [enemy1Selector, enemy2Selector, enemy3Selector]
    const enemyDispatches= [
        (e:enemyStatusType)=>createEnemyDispatch(createEnemy1(e)),
        (e:enemyStatusType)=>createEnemyDispatch(createEnemy2(e)),
        (e:enemyStatusType)=>createEnemyDispatch(createEnemy3(e)),
    ]
    
    const userAt = useAppSelector(state=>state.reducer.userStatusReducer.status.at)

    // let [enemy1max, setEnemy1max]= useState(0)
    // let [enemy2max, setEnemy2max]= useState(0)
    // let [enemy3max, setEnemy3max]= useState(0)

    // const [enemy1at, setEnemy1at] = useState(false)
    // const [enemy2at, setEnemy2at] = useState(false)
    // const [enemy3at, setEnemy3at] = useState(false)

    // const enemies:Array<JSX.Element> = [];

    const [dialog, setDialog] = useState<string>("");
    let dragX = useMotionValue(0);
    let dragY = useMotionValue(0)


    
    const [drag, setDrag]= useState(0);
    // const [enemy1, setEnemy1] = useState<JSX.Element[]|null>(null)
    // const [enemy2, setEnemy2] = useState<JSX.Element[]|null>(null)
    // const [enemy3, setEnemy3] = useState<JSX.Element[]|null>(null)
    // const enemyhp1:MotionValue = motionValue(enemy1Selector.hp) 
    // const enemyhp2:MotionValue = motionValue(enemy2Selector.hp) 
    // const enemyhp3:MotionValue = motionValue(enemy3Selector.hp) 
    const [MaxHp, setMaxHp] = useState<Array<number>>([]);

    const enemyArr = [<Genkiman/>,<Hentaiyou/>]
    let enemycomponents:Array<JSX.Element|null> = [null, null, null]
    useEffect(()=>{
        socket.on("screenSwitch", (data)=>{
            // setIsEncount(true)
            console.log("entounttttttttttt")
            
            setSceneState(appearedScene);
            
            fetch("http://localhost:8080/enemy/create", {
                method:"GET",
                headers: {"Content-Type":"application/json"} 
            }).then(async response=>{
                if(!response.ok){
                    if(response.status === 400) setError("incorrect password")
                    else if(response.status === 404)setError("user doesnot exist")
                    else setError("Something went wrong :<")
                }else{
                    const data:Array<enemyStatusType> = await response.json();
                    // console.log(data, "these are enemies")
                    // const enemyInsideCompos:Array<JSX.Element|null> = data.map((each,i)=>{
                    //     const one = enemyArr.filter(e=>e.type.name === each.name)
                    //     enemyDispatches[i](each);
                    //     return one
                    // })

                    data.forEach((enemy,i)=>{
                        enemyDispatches[i](enemy)
                        setMaxHp((pre)=>[...pre, enemy.hp])
                    })

                    
                    // setEnemy1(enemyArr.filter(e=>e.type.name === data.enemy1.name))
                    // createEnemyDispatch(createEnemy1(data.enemy1))
                    // setEnemy1max(data.enemy1.hp)
                    // enemies=
                    
                    // setEnemy2(enemyArr.filter(e=>e.type.name === data.enemy2.name))
                    // createEnemyDispatch(createEnemy2(data.enemy2))
                    // setEnemy2max(data.enemy2.hp)

                    // setEnemy3(enemyArr.filter(e=>e.type.name === data.enemy3.name))
                    // createEnemyDispatch(createEnemy3(data.enemy3))
                    // setEnemy3max(data.enemy3.hp)
                    
                }
            })
        })

        
    },[socket])

    // useEffect(()=>{enemy1max=enemy1Selector.hp},[enemy1])
    // useEffect(()=>{enemy2max=enemy2Selector.hp},[enemy2])
    // useEffect(()=>{enemy3max=enemy3Selector.hp},[enemy3])
    
    useNonInitialEffect(()=>{
        setDialog(appearDialog);
    },[sceneState === appearedScene])

    const [startover, setStartover] = useState(0)

    useNonInitialEffect(()=>{
        setDialog(yourturnDialog);
    },[sceneState === yourTurnScene])

    const enemyControll = useAnimationControls()
    useNonInitialEffect(()=>{
        const ramdom = Math.floor(Math.random()*3)
        enemyControll.start({
            scale:[2,2,2,1,1],
            rotate:[0,0,50,-50,0]
        }).then(()=>{
            getAttackFromEnemy({attack:enemySelectors[ramdom].at})
        }).then(()=>{
            setSceneState(yourTurnScene)
        })

    },[sceneState===enemiesTurnScene])

    // useNonInitialEffect(()=>{
    //     if(whichEnemyAt===0){
    //         createEnemyDispatch(atackEnemy1({atack:userAt}))
    //     }else if(whichEnemyAt===1){
    //         createEnemyDispatch(atackEnemy2({atack:userAt}))
    //     }else if(whichEnemyAt===2){
    //         createEnemyDispatch(atackEnemy3({atack:userAt}))
    //     }
    // },[sceneState === yourActionScene])



    // useNonInitialEffect(()=>{
    //     const attackNum = Math.floor(Math.random()*4)
    //     let enemyName = "";
        
        

    //         if(attackNum === 1){
    //             enemyName = enemy1Selector.name
                
    //             createEnemyDispatch(getAttackFromEnemy({attack:enemy1Selector.at}))
                
    //             setStartover(1)
    //         }else if(attackNum === 2){
    //             enemyName = enemy2Selector.name

    //             createEnemyDispatch(getAttackFromEnemy({attack:enemy2Selector.at}))
                
    //             setStartover(1)
    //         }else{
    //             enemyName = enemy3Selector.name

    //             createEnemyDispatch(getAttackFromEnemy({attack:enemy3Selector.at}))
                
    //             setStartover(1)
    //         }
    //         setDialog(enemyName+enemyDialog)
        

       
    // },[sceneState===enemiesTurnScene])


    // useNonInitialEffect(()=>{
    //         setSceneState(2);
    //         setDialog(yourturnDialog)
    //         setEnemyDragState(0)
    //         setStartover(0)
    // },[startover===1])

    const isDefeatAll = enemySelectors.every(function(enemy){
        return enemy.hp<=0
    })

    useNonInitialEffect(()=>{
        setSceneState(7)
        socket.emit("back", "backback")
    },[isDefeatAll])


    // console.log(isDefeatAll, "isdefeatall")

    // useNonInitialEffect(()=>{
    // },[sceneState===7&&enemy1Selector.hp<=0&&enemy2Selector.hp<=0&&enemy3Selector.hp<=0])
    
    // const variant = {
    //     hidden:{
           
    //     },
    //     show:{
    //         x:[-1600,400,0,0,0],
    //         scale:[0.7,0.7,0.7,0.4,1]
    //     },
    //     back:{
    //         x:[0,400,0,0,-1600],
    //         scale:[0.7,0.7,0.7,0.4,1]
    //     }
    // }
    
    return ( 

        <>
                    <motion.div 
                        transition = {sceneState===enemiesTurnScene?{
                                times:[0,0.5,0.6,0.7, 1],duration:0.5, delay:2
                            }:{}}
                        animate = {sceneState===enemiesTurnScene&&{
                            rotate:[0,-5,10,-5, 0]
                        }}
                        className={styles.innnerBattleBox}>

                        <div className={styles.enemeyField}>
                            
                            {enemySelectors.map((enemy,i)=>{
                                const enemyCompo = enemyArr.filter(e=>e.type.name === enemy.name)
                                return <motion.div animate={enemy.hp===0?{opacity:0}:{opacity:1}}>
                                    <div>{enemy.hp}</div>
                                    <div style={{display:"flex",justifyContent:"space-between", width:400, height:40,}}>
                                        <div className={styles.enemyName}>{enemy.name}</div>
                                        <div style={{
                                            display:"flex",
                                            justifyContent:"center",
                                            alignItems:"center",
                                            
                                            width:"60%",
                                            height:"70%",
                                            background:`linear-gradient(to left, black ${(1-enemy.hp/MaxHp[i])*100}%, red ${(1-enemy.hp/MaxHp[i])*100}% ${enemy1Selector.hp/MaxHp[i]*100}%)`,
                                            borderRadius:"10px",
                                            border:"solid white 5px"
                                    }}></div>
                                    </div>
                                    <motion.div animate={enemyControll}>
                                        {enemyCompo}
                                    </motion.div>
                                </motion.div>
                            })}

                            
                            
                            {/* <motion.div>
                                    <div>{enemySelectors[0].hp}</div>
                                    <div style={{display:"flex",justifyContent:"space-between", width:400, height:40,}}>
                                        <div className={styles.enemyName}>{enemySelectors[0].name}</div>
                                        <div style={{
                                        display:"flex",
                                        justifyContent:"center",
                                        alignItems:"center",
                                        
                                        width:"60%",
                                        height:"70%",
                                        background:`linear-gradient(to left, black ${(1-enemySelectors[0].hp/20)*100}%, red ${(1-enemySelectors[0].hp/20)*100}% ${enemy1Selector.hp/20*100}%)`,
                                        borderRadius:"10px",
                                        border:"solid white 5px"
                                    }}></div>
                                    </div>
                                    <motion.div>
                                        {enemyArr}
                                    </motion.div>
                                </motion.div> */}
                            
                            {/* <motion.div className={styles.fieldEach} 
                                animate={enemy1Selector.hp<=0?{opacity:0}:{opacity:1}}
                                transition={{}}
                            >
                                <div style={{display:"flex",justifyContent:"space-between", width:400, height:40,}}>
                                    <div className={styles.enemyName}>{enemy1Selector.name}:</div>
                                    <div style={{
                                        display:"flex",
                                        justifyContent:"center",
                                        alignItems:"center",
                                        
                                        width:"60%",
                                        height:"70%",
                                        background:`linear-gradient(to left, black ${(1-enemy1Selector.hp/enemy1max)*100}%, red ${(1-enemy1Selector.hp/enemy1max)*100}% ${enemy1Selector.hp/enemy1max*100}%)`,
                                        borderRadius:"10px",
                                        border:"solid white 5px"
                                    }}></div>
                                    
                                </div>
                                <motion.div 
                                transition={{times:[0,0.2,0.4,1],duration:2}}
                                exit = {{x:0, scale:0}}
                                animate={enemy1at===true?{
                                    zIndex:[100,100,100,100],
                                    x:[500,-500,500,500],
                                    scale:[1,1,1,1.5]
                                }:enemyDragState===enemy1position?{border:"solid 5px red", borderRadius:"20px"}:{}}>
                                    {enemy1}
                                </motion.div>
                                
                            </motion.div>
                            <motion.div className={styles.fieldEach} animate={enemy2Selector.hp<=0?{opacity:0}:{opacity:1}}>
                                <div style={{display:"flex",justifyContent:"space-between", width:400, height:40,}}>
                                    <div className={styles.enemyName}>{enemy1Selector.name}:</div>
                                    <div style={{
                                        display:"flex",
                                        justifyContent:"center",
                                        alignItems:"center",
                                        
                                        width:"60%",
                                        height:"70%",
                                        background:`linear-gradient(to left, black ${(1-enemy2Selector.hp/enemy2max)*100}%, red ${(1-enemy2Selector.hp/enemy2max)*100}% ${enemy2Selector.hp/enemy2max*100}%)`,
                                        borderRadius:"10px",
                                        border:"solid white 5px"
                                    }}></div>
                                    
                                </div>
                                
                                <motion.div 
                                transition={{times:[0,0.2,0.4,1],duration:2}}
                                exit = {{x:0, scale:0}}
                                animate={enemy2at?{
                                        zIndex:[100,100,100,100],
                                        x:[500,-500,0,0],
                                        scale:[1,1,1,1.5]
                                }:enemyDragState===enemy2position?{border:"solid 5px red", borderRadius:"20px"}:{}}>
                                    {enemy2}
                                </motion.div>
                                
                            </motion.div>
                            <motion.div className={styles.fieldEach} animate={enemy3Selector.hp<=0?{opacity:0}:{opacity:1}}>
                                <div style={{display:"flex",justifyContent:"space-between", width:400, height:40,}}>
                                        <div className={styles.enemyName}>{enemy1Selector.name}:</div>
                                        <div style={{
                                        display:"flex",
                                        justifyContent:"center",
                                        alignItems:"center",
                                        
                                        width:"60%",
                                        height:"70%",
                                        background:`linear-gradient(to left, black ${(1-enemy3Selector.hp/enemy3max)*100}%, red ${(1-enemy3Selector.hp/enemy3max)*100}% ${enemy3Selector.hp/enemy3max*100}%)`,
                                        borderRadius:"10px",
                                        border:"solid white 5px"
                                        }}></div>
                                </div>
                                <motion.div 
                                transition={{times:[0,0.2,0.4,1],duration:2}}
                                exit = {{x:0, scale:0}}
                                animate={enemy3at?{
                                    zIndex:[100,100,100,100],
                                        x:[-500,500,-500,-500],
                                        scale:[1,1,1,1.5]
                                }:enemyDragState===enemy3position?{border:"solid 5px red", borderRadius:"20px"}:{}}>
                                    {enemy3}
                                </motion.div>
                                
                            
                            </motion.div> */}
                            
                        </div>
                        
                        <div style={{display:"flex", justifyContent:"center", zIndex:3}}
                            onClick = {()=>setSceneState(2)} 
                            className={styles.hp}
                        >  
                            <HP 
                                dialog = {dialog} 
                                sceneState = {sceneState}
                                dragX = {(x)=>dragX.set(x)}
                                dragY = {(y)=>dragY.set(y)}
                                dragState={(i)=>setDrag(i)}
                                enemyDragState={(d)=>setEnemyDragState(d)}
                                childSceneState = {(s)=>setSceneState(s)}
                                startover = {startover}
                                enemyAttackNum = {(n)=>setWhichEnemyAt(n)}
                            ></HP>
                        </div>
                        
                        <div className={styles.option}>
                            <motion.div 
                                    className={styles.shield}
                                    animate={drag===2?{
                                        width:"50%",
                                        height:"100%"
                                    }:{}}
                            >shield</motion.div>
                            <motion.div 
                                    className={styles.item}
                                    animate={drag===3?{
                                        width:"50%",
                                        height:"100%"
                                    }:{}}
                            >item</motion.div>
                        </div>
                    <button onClick={(e)=>{createEnemyDispatch(restoreHP({hp:20}))}}>restore</button>
                    <button onClick={(e)=>{createEnemyDispatch(maketozero1())}}>;alskj</button>
                    <button onClick={(e)=>{createEnemyDispatch(maketozero2())}}>;alskj</button>
                    <button onClick={(e)=>{createEnemyDispatch(maketozero3())}}>;alskj</button>
                    </motion.div>
                    
            
            
            {/* <motion.div drag className={styles.you}>
                <h1>oi</h1>
            </motion.div> */}
        </>
     );
}

export default Battle;