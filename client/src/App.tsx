import { useState } from 'react'
import reactLogo from './assets/react.svg'
//import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import styles from "./App.module.scss"
import socketIO, {io, Socket, SocketOptions} from "socket.io-client"
import Hello from './component/Hello'
import Game from './mainroutes/Game'
import Signup from './mainroutes/Signup'
import Login from './mainroutes/Login'
import Home from './mainroutes/Home'
import env from 'ts-react-dotenv'
import { useNonInitialEffect } from './customhooks/useNonInitialEffect'

export interface ServerToClientEvents {
  screenSwitch:(hit:string)=>void;
  backSwitch:(backback:string)=>void;
}

export interface ClientToServerEvents {
  hello: () => void;
  oi:(input:string)=>void;
  encount:(encount:string)=>void;
  back:(backback:string)=>void;
}
// const url:string = process.env.SERVER_URL; 

const socket:Socket<ServerToClientEvents, ClientToServerEvents>= io("http://localhost:8080")

function App() {
  
  
  return (
   <>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home></Home>}></Route>
        <Route path='/game' element = {<Game socket = {socket}></Game>}></Route>
        <Route path = "/signup" element = {<Signup></Signup>}></Route>
        <Route path = "/login" element = {<Login></Login>}></Route>
      </Routes>
    </BrowserRouter>

      
   </>
  )
}

export default App
