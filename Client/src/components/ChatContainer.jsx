import React, {useState,useEffect, useRef} from 'react'; 
import styled from 'styled-components'
import Logout from './Logout';
import ChatInput from './ChatInput';
import Messages from './Messages';
import {getAllMessageRoute, sendMessageRoute} from "../utils/APIRoutes";
import axios from 'axios';
import {v4 as uuidv4} from "uuid";


const ChatContainer = ({currentChat, currentUser,socket}) => {
const [arrivalMessage, setArrivalMessage] = useState(null);
const scrollRef = useRef();
const handleSendMsg = async (msg) => { 
        await axios.post(sendMessageRoute,{
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        });
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg});
        setMessages(msgs);
    };

    useEffect(() => {
        if(socket.current) {
            socket.current.on("msg-recieve",(msg) => {
                setArrivalMessage({fromSelf:false,message: msg})
            })
        }
    },[]);

    useEffect(() => {
     arrivalMessage && setMessages((prev)=> [...prev, arrivalMessage]);
    },[arrivalMessage])
    

    const [currentChatName, setCurrentChatName] = useState(undefined);
        const [currentChatImage, setCurrentChatImage] = useState(undefined);
      
        useEffect (() =>   { 
          if(currentChat) {
      setCurrentChatName(currentChat.username);
      }
      }, [currentChat]);

      useEffect (() =>   { 
        if(currentChat) {
    setCurrentChatImage(currentChat.avatarImage);
    }
    }, [currentChat]);

const [messages, setMessages] = useState([]);

useEffect( () => {
    async function fetchData(msg) {  
   if(currentChat){
        const response = await axios.post(getAllMessageRoute, {
        from : currentUser._id,
        to : currentChat._id,
        message: msg,
    });
    setMessages(response.data);
}
}
fetchData();
},[currentChat,messages]);

     useEffect(() => {
       scrollRef.current ?.scrollIntoView({ behaviour: "smooth"})
     },[messages]);


  return (
    <Container>
        <div className="chat-header">
          <div className="user-details">
            <div className="avatar">
            <img src ={`data:image/svg+xml;base64,${currentChatImage}`} alt="avatar" />
            </div>
            <div className="username">
                <h3>{currentChatName}</h3>
            </div>
          </div>
          {/* <Meet /> */}
          <Logout />
            </div>
            <div className="chat-messages">
                {
                  
                    messages.map((message) => {
                        return (
                            <div ref={scrollRef} key={uuidv4()}>
                                <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                                 <div className="content">
                                    <p>
                                        {message.message}
                                       {<p className='sizes'> {message.time}  </p> }
                                       
                                    </p>
                                 </div>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
          <ChatInput handleSendMsg={handleSendMsg} /> 
     </Container>
  )
}

const Container = styled.div`
display: grid;
background-color:#acc9fc;
grid-template-rows: 10% 80% 10%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 0 2rem;
  .user-details {

    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 2.5rem;
      }
    }
    .username {
      h3 {
        color:#020c52;
      }
    }
  }
}
.sizes{
  margin-top:0.5rem;
  font-size:0.7rem;
}
.chat-messages {
  padding: 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: #020c52;
    }
  }
  .recieved {
    justify-content: flex-start;
    .content {
      background-color: #0725f2;
    }
  }
}
`;

export default ChatContainer