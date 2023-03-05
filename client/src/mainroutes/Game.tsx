import * as React from "react";
import { Component } from "react";
import { useState, useEffect } from "react";
import Battle from "../gamecompo/Battle";
import Field, { socketType } from "../gamecompo/Field";
import { motion, useAnimationControls } from "framer-motion";
import styles from "./Game.module.scss";
import { useAppSelector } from "../store/store";

function Game({ socket }: socketType) {
  const [screenNUm, setScreenNum] = useState(0);
  const [battleMode, setBattleMode] = useState(false);
  const fieldControl = useAnimationControls();
  const battleControl = useAnimationControls();
  const userStatuSelector = useAppSelector(
    (state) => state.reducer.userStatusReducer
  );

  console.log(userStatuSelector);

  useEffect(() => {
    socket.on("screenSwitch", async (data) => {
      setBattleMode(true);
      console.log("entounttttttttttt");
      await fieldControl.start({
        scale: [1, 2, 0.5, 0.5, 3, 1, 0.5],
        rotate: [0, 50, 20, 30, 20, 0, 0],
        x: [0, 0, 0, 0, 0, 0, 0, 0, -300, 1500],
        transition: { duration: 2 },
      });

      await battleControl.start({
        x: [-1600, 400, 0, 0, 0],
        scale: [0.7, 0.7, 0.7, 0.4, 1],
        transition: { duration: 2 },
      });

      await socket.emit("encount", "encounted");
    });

    socket.on("backSwitch", async (data) => {
      console.log("modoruzooo");

      if (data === "backback") {
        await battleControl.start({
          x: [0, 0, 0, 400, -1600],
          scale: [1, 0.7, 0.7, 0.4, 0.7],
          transition: { duration: 2 },
        });
        await fieldControl.start({
          scale: [0.5, 2, 0.5, 0.5, 3, 1, 1],
          rotate: [0, 50, 20, 30, 20, 0, 0],
          x: [1500, 300, 0, 0, 0, 0, 0, 0, 0, 0],
          transition: { duration: 2 },
        });

        await socket.emit("back", "backbackdone");
      }
    });
  }, [socket]);

  return (
    <>
      <div className={styles.gameBox}>
        <motion.div
          animate={fieldControl}
          style={{ position: "absolute", width: "100vw", height: "100vh" }}
        >
          <Field socket={socket}></Field>
        </motion.div>

        <motion.div
          animate={battleControl}
          initial={{ x: -1600 }}
          style={{ position: "absolute", width: "100vw", height: "100vh" }}
        >
          <Battle socket={socket}></Battle>
        </motion.div>
      </div>
    </>
  );
}

export default Game;
