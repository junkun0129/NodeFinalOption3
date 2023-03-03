import * as React from 'react';
import { Component } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useEffect, useState } from 'react';
import { useMotionValue,useMotionValueEvent,useMotionTemplate, useTransform, motion, MotionValue, animate, useAnimationControls } from 'framer-motion';
import {star} from "../gamecompo/SvgPath"
import { atackEnemy1, atackEnemy2, atackEnemy3 } from '../store/features/enemySlice';
import { useNonInitialEffect } from '../customhooks/useNonInitialEffect';

type dialogType = {
    dialog:string,
    sceneState:number,
    dragX:(x:number)=>void,
    dragY:(y:number)=>void,
    dragState:(i:number)=>void,
    enemyDragState:(i:number)=>void,
    childSceneState:(s:number)=>void,
    startover:number,
    enemyAttackNum:(n:number)=>void
}
function HP({dialog, sceneState, dragX, dragY, dragState, enemyDragState, childSceneState,startover, enemyAttackNum}:dialogType) {

    
    const hp = useAppSelector(state=>state.reducer.userStatusReducer.status.hp)
    const mxHp = useAppSelector(state=>state.reducer.userStatusReducer.status.maxmumHp)
    const playerAT = useAppSelector(state=>state.reducer.userStatusReducer.status.at)
    const dispatch = useAppDispatch();
    const motionHP = useMotionValue(hp);
    const sceneStateMotionValue = useMotionValue(sceneState);
    
    console.log(mxHp, ";lkj;lkj;l")
    //drag status
    let [dragStatus, setDragStatus] = useState(0);
    const [dragEndPosition, setDragEndPosition] = useState(0);
    const dragEndX= useMotionValue(0);
    const dragEndY = useMotionValue(0);
    const [causeRender, setCauseRender] = useState(""); 
    const [enemyAttacknum, setEnemyAttacknum] = useState(0);
    const normalMode = 0;
    const attackMode = 1;
    const shieldMode = 2;
    const itemMode = 3;

    const enemy1Position = 1;
    const enemy2Position = 2;
    const enemy3Position = 3;
    const noenemyposition = 0;
    
    
    let X = useMotionValue(0);
    let Y = useMotionValue(0);

    let [clicked, setClicked] = useState(0);
    // const rote = useMotionValue(0);

    
    const [ishenge, setIshenge] = useState(false);
    const dialogOpacity = useTransform(
    sceneStateMotionValue, 
    [0  ,1,2,3  ,4,5  ,0],
    [0,0.8,0,0,0.8,0,0.8]
    )
    
    // useEffect(()=>{
    //     maxhp = hp;
    // },[])

    useNonInitialEffect(()=>{
        console.log("droped")
    },[dragEndPosition])

    //mouse end position
    useMotionValueEvent(dragEndX||dragEndY, "change",()=>{
        if(dragEndY.get()<100){
            
            if(dragEndX.get()<400){
                // dispatch(atackEnemy1({atack:playerAT}))
                setDragEndPosition(enemy1Position);
                enemyAttackNum(0)
                setEnemyAttacknum(0)
                childSceneState(3)
            }else if(400<dragEndX.get()&&dragEndX.get()<1000){
                // dispatch(atackEnemy2({atack:playerAT}))
                setDragEndPosition(enemy2Position)
                enemyAttackNum(1)
                setEnemyAttacknum(1)
                childSceneState(3)
            }else{
                // dispatch(atackEnemy3({atack:playerAT}))
                setDragEndPosition(enemy3Position);
                enemyAttackNum(2)
                setEnemyAttacknum(2)
                childSceneState(3)
            }
        }else{
            setDragEndPosition(noenemyposition)
        }


    })

    //mouse move position
    useMotionValueEvent(X||Y,"change", ()=>{
        if(Y.get()<400){
            setDragStatus(attackMode)
            if(X.get()<400){
                enemyDragState(enemy1Position)
            }else if(400<X.get()&&X.get()<1000){
                enemyDragState(enemy2Position)
            }else{
                enemyDragState(enemy3Position)
            }
        }else{
            enemyDragState(noenemyposition)
            if(X.get()>600){
                setDragStatus(itemMode)
            }else if(X.get()<400){
                setDragStatus(shieldMode)
            }else{
                setDragStatus(normalMode)
            }
        }
        // console.log(dragStatus)
        // console.log()
    } )
   
    // const HpTranform:MotionValue<number> = useTransform(motionHP, [0, maxhp], [0, 100])
    // const theOtherSide = useTransform(motionHP, [0,maxhp], [100,0])
    // // console.log(sceneState, "scene state")
    // console.log(dragStatus, "drag status")
    useEffect(()=>{
        dragState(dragStatus)
    },[dragStatus])

    const attackAnimeControl = useAnimationControls()

    useNonInitialEffect(()=>{
        console.log("clicked")
            attackAnimeControl.start({
                width:200,
                height:200,
                borderRadius:"100px",
                border:"solid 6px white",
            })
        
    },[sceneState===2])

    useNonInitialEffect(()=>{
        attackAnimeControl.start({
            width:"100%",
            height:"240px"
        })
    },[sceneState===4])
   
    useNonInitialEffect(()=>{

        attackAnimeControl.start({
            
            x:[-400,-400,-700,-700,0],
            y:[-400,-400,-100,-100,0],
            rotate:[20,-20,-20,0,0],
            
        }).then(()=>{

            console.log("apsodfijas;dfoj")
            if(enemyAttacknum===0){
                dispatch(atackEnemy1({atack:playerAT}))
            }else if(enemyAttacknum===1){
                dispatch(atackEnemy2({atack:playerAT}))
            }else if(enemyAttacknum===2){
                dispatch(atackEnemy3({atack:playerAT}))
            }
        }).then(()=>{
            // attackAnimeControl.start({
            //     width:"100%",
            //     height:"240px"
            // })
            console.log("whole world")
            setDragStatus(0);
            childSceneState(4)
        })
        // .then(()=>{

        // })
        
    },[dragEndPosition])

    useNonInitialEffect(()=>{
        switch(dragStatus){
            case itemMode:
                attackAnimeControl.start({
                    width:300,
                    height:230,
                    borderRadius: "121px 0px 200px 0px",
                    border:"solid 6px white",
                })
                break;
            case shieldMode:
                attackAnimeControl.start({
                    width:250,
                    height:230,
                    borderRadius:"0px 0px 200px 200px",
                    border:"solid 6px white"
                })
                break;
            case attackMode:
                attackAnimeControl.start({
                    width:50,
                    height:250,
                    borderRadius:"200px 200px 0px 0px",
                    border:"solid 6px white",
                })
                break;
            default:
                attackAnimeControl.start({
                    width:200,
                    height:200,
                    borderRadius:"100px",
                    border:"solid 6px white",
                })
        }
    },[dragStatus])

    console.log(dragEndPosition, ";lkj")



    
    // let positions = useMotionValue("relative");
    // let toppn = useMotionValue(1);
    // let [kk, setKk] = useState(1)
    // let [jj, setJj] = useState(1);
    // useMotionValueEvent(rote, "animationComplete", ()=>{
    //     if(kk===1){
    //     console.log("anime ends ")
    //         childSceneState(3)
    //         setKk(2);
    //         setJj(3)
    //     }
        
    // })

    // useMotionValueEvent(toppn, "animationComplete", ()=>{
    //     if(jj>2){
    //         console.log("jumbiii")
    //         childSceneState(4)
    //     }
        
    // })

    // useEffect(()=>{
    //     setDragStatus(0)
    //     setDragEndPosition(0)
    // },[startover===1])

    
    
    // console.log(dragEndPosition, "dragendposition")
    return ( 
        <>
            <motion.div 
                drag 
                dragConstraints={{ left: 0, right: 0, top:0, bottom:0 }}
                dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
                dragElastic={0.8}
                onDragEnd={(e, i)=>{
                    dragEndX.set(i.point.x)
                    dragEndY.set(i.point.y)
                    setDragStatus(0)
                }}
                onDrag = {(event, info)=>{
                    // console.log(info.point.x, info.point.y)
                    dragX(info.point.x)
                    dragY(info.point.y)
                    X.set(info.point.x)
                    Y.set(info.point.y)
                    
                }}
                onClick={()=>setClicked(clicked++)}
                animate={attackAnimeControl}
                
                // transition={dragEndPosition === enemy1Position || dragEndPosition === enemy2Position || dragEndPosition === enemy3Position
                // ?{duration:2, times:[0,0.3,0.4,0.8,1]}
                // :{duration:1,stiffness:50,damping:10, type:"spring"}}
                style={{position:"relative",width:"100%", height:"240px", border:"10px solid white",borderRadius:"20px", boxSizing:"border-box", background: `linear-gradient(to left, black ${(1-hp/mxHp)*100}%, lime ${(1-hp/mxHp)*100}% ${hp/mxHp*100}%)`}}>
                

                {/* <motion.div style={{width:`${HpTranform}%`, height:"100%",backgroundColor:"lime"}}
                            transition={{duration:1,stiffness:50,damping:10, type:"spring"}}
                            animate = {sceneState === 2 && dragStatus === attackMode?{
                                width:"100%",
                                height:`100%`,
                                borderRadius:"100px",
                                
                            }:sceneState === 2&&{
                                width:"100%",
                                height:`20%`,
                                borderRadius:"100px",
                               
                            }}   
                >
                </motion.div> */}
         
                <motion.div
                    style={{position:"absolute",top:"0px",opacity:dialogOpacity,zIndex:"100",backgroundColor:"black",width:"100%", height:"100%" }}
                ></motion.div>

                <motion.h1 style={{position:"absolute",top:"10px",left:"50px",color:"white",  zIndex:"100"}}
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           transition = {{delay:1, duration:1}}
                >{dialog}</motion.h1>
            </motion.div>
        </>
     );
}

export default HP;