module.exports = (http)=>{
    const soketIO = require("socket.io")(http, {
        cors:{
            origin: "http://localhost:5173"
        }
    })

    soketIO.on("connection", (socket)=>{
        // console.log(">>>>>>>", socket, ">>>>>>>>>")

        socket.on("oi", (data)=>{
            console.log(data, "ikuzoooooooooooooo")
        })

        socket.on("encount", (data)=>{
            
            if(data === "hit"){

                socket.emit("screenSwitch", "hit");
            }
            
        })

        socket.on("back", (data)=>{
            if(data=="backback"){

                socket.emit("backSwitch", "backback")
                console.log("kaettekitaOoo")
            }
        })


    })
    

}
