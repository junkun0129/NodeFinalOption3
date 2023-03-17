import * as React from "react";
import { Component, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServerToClientEvents, ClientToServerEvents } from "../App";
import { Socket } from "socket.io-client";
import { GamePanel } from "../fieldcompo/GamePanel";
import { motion } from "framer-motion";
import styles from "./Field.module.scss";
import { useNonInitialEffect } from "../customhooks/useNonInitialEffect";
import { useAppSelector } from "../store/store";
import reuseValue from "../reuseValue";

export type socketType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};
function Field({ socket }: socketType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [game, setGame] = useState<GamePanel | null>(null);
  const [isEncount, setIsEncount] = useState<boolean>(false);
  const user = useAppSelector((state) => state.reducer.userStatusReducer);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;
    let game = new GamePanel(c, socket);
    setGame(game);
  }, []);

  useEffect(() => {
    game?.setup();
  }, [game]);

  useEffect(() => {
    socket.on("save", (data) => {
      console.log(data, "this is back you");
      fetch(`${reuseValue.serverURL}/user/save`, {
        method: "POST",
        body: JSON.stringify({
          name: user.name,
          level: user.status.level,
          at: user.status.at,
          exp: user.status.exp,
          hp: user.status.hp,
        }),
        headers: { "Content-Type": "application/json" },
      }).then(async (res) => {
        const data = await res.json();
      });
    });
  }, [socket]);

  return (
    <>
      <motion.canvas
        className={styles.field}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></motion.canvas>
    </>
  );
}

export default Field;
