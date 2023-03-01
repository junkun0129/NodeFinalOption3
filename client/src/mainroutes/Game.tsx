import * as React from 'react';
import { Component } from 'react';
import { useState, useEffect } from 'react';
import Battle from '../gamecompo/Battle';
import Field, { socketType } from '../gamecompo/Field';
import {motion, useAnimationControls} from "framer-motion";
import styles from "./Game.module.scss";
import { useAppSelector } from '../store/store';

function Game({socket}:socketType) {

    const [screenNUm, setScreenNum] = useState(0);
    const [battleMode, setBattleMode] = useState(false)
    const fieldControl = useAnimationControls()
    const battleControl = useAnimationControls()
    const userStatuSelector = useAppSelector(state=>state.reducer.userStatusReducer);
    console.log(userStatuSelector)
  
    useEffect(()=>{
        socket.on("screenSwitch", (data)=>{
            setBattleMode(true)
            console.log("entounttttttttttt")
            fieldControl.start({
                scale: [1, 2, 0.5, 0.5, 3, 1 ,0.5],
                rotate: [0, 50, 20, 30, 20, 0, 0],
                x:[0,0,0,0,0,0,0,0,-300,1500],
                transition:{duration:2}
            })

            battleControl.start({
                x:[-1600,400,0,0,0],
                scale:[0.7,0.7,0.7,0.4,1],
                transition:{delay:2, duration:2}
            })



          })
        

    },[socket])

    return ( 
        <>
        <div className={styles.gameBox}>
            <motion.div animate={fieldControl} style={{position:"absolute"}}>
                <Field socket={socket}></Field>
            </motion.div>

            <motion.div animate={battleControl} style={{position:"absolute"}}>
                <Battle socket = {socket}></Battle>
            </motion.div>
        </div>
        
        
        </>
     );
}

export default Game;