const express = require("express") 
const cors = require("cors")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messageRoute");
const app = express(); 
const socket = require("socket.io");    
const path = require("path")
require("dotenv").config();

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname+"/public")))
// app.get("/", (req, res) => {
//     res.send("Hello")
// })

if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("/*", function(req, res) {
        res.sendFile(path.join(__dirname, "./Client/build/index.html"));
      });
}

app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoute) 

app.route('/login').get(function(req, res) { 
    return res.sendFile(path.join(__dirname, './src/pages/Login.jsx')); 
});

app.route('/register').get(function(req, res) { 
    return res.sendFile(path.join(__dirname, './src/pages/Register.jsx')); 
});

app.route('/chat').get(function(req, res) { 
    return res.sendFile(path.join(__dirname, './src/pages/Chat.jsx')); 
});

app.route('/').get(function(req, res) { 
    return res.sendFile(path.join(__dirname, './src/pages/Login.jsx')); 
});



const url = process.env.uri;


mongoose.connect(url,{
useNewUrlParser: true,
useUnifiedTopology: true,
}).then(() => {
    console.log("Database Connected Successfully");
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is Started on Port ${process.env.PORT}`);
}); 


 const io = socket(server, {
     cors: {
         origin:"http://localhost:3000",
         credentials: true,
     },
 });

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    });

    socket.on("send-msg",(data) => {
        const sendUserSocket = onlineUsers.get(data.to);
       if(sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve",data.message);
       }  
    })
})