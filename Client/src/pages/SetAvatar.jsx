import React, { useState, useEffect} from 'react'
import styled from "styled-components"
import { useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from '../utils/APIRoutes';
import {Buffer} from 'buffer';
import loader from '../assets/loading.gif'

const SetAvatar = () => {
    const api = "https://api.multiavatar.com/CZksYxvERc6O3V";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [IsLoading, setIsLoading] = useState(true); 
    const [selectedAvatar, setSelectedAvatar] = useState(undefined); 

const toastOptions = {
        position:"bottom-right",
        autoClose : 5000,
        pauseOnHover : true,
        draggable :  true,
        theme : "dark",
        };
    
        useEffect(()=> {
            if(!localStorage.getItem('chat-app-user')) {
             navigate('/login')  
            }}
            ,[]);

         const setProfilePicture = async () => {
            if (selectedAvatar === undefined){
                toast.error("Please Select an Avatar", toastOptions)
            }
            else {
                const user = await JSON.parse(localStorage.getItem("chat-app-user"));
                const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
                    image: avatars[selectedAvatar],
                });
                console.log(data);
                if(data.isSet) {
                    user.isAvatarImageSet =true;
                    user.avatarImage = data.image;
                    localStorage.setItem("chat-app-user",JSON.stringify(user));
                    navigate('/chat');
                }
                else {
                    toast.error("Error in Setting up Avatar. Please Try Again.",toastOptions);
                }
            } 
         };
         function refreshPage() {
          window.location.reload(false);
        }
       
          useEffect( () => {
            async function fetchData() {
                const data = [];
                for(let i=0; i<4; i++){
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
                 }
     setAvatars(data);
     setIsLoading(false);
             }
            fetchData();
                },[]);

  return (
    <>
    {  IsLoading ? <Containers>
       <img src={loader} alt="loader" className="loader" />
       <h1>Please Wait...</h1>
                </Containers> : ( <Container>
        <div className="title-container">
        <h1>
            Pick an Avatar as a Profile Picture
        </h1>
    </div>
  <div className="avatars">
  {
            avatars.map((avatar, index) => {
                return (
                    <div key={index} className={`avatar ${
                        selectedAvatar === index ? "selected" : "" }`}>
                        <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" 
                        key={avatar}
                        onClick={()=> setSelectedAvatar(index)} />
                    </div>  
                       );
              })}
  </div>
  <button onClick={setProfilePicture} className="submit-btn">
        Set as Profile Picture
      </button>
      <button onClick={refreshPage} className="avatar-btn">New Avatars</button>
      <ToastContainer /> 
</ Container>
 )}  
  </ >
  )
};
const Containers = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #000;
height: 100vh;
width: 100vw;
color: #fff;

`;
const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100vw;
color: #fff;
.loader {
  max-inline-size: 100%;
}
.title-container {
  h1 {
    color: white;
  }
}
.avatars {
  display: flex;
  gap: 2rem;
  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4rem;
    border-radius: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;
    img {
      height: 6rem;
      transition: 0.5s ease-in-out;
    }
  }
  .selected {
    border: 0.4rem solid #4e0eff;
  }
}
.avatar-btn {
  max-width: 180px;
  margin-left: 1000px;
  background-color: #4e0eff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  &:hover {
    background-color: #4e0eff;
  }
}
.submit-btn {
  background-color: #4e0eff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  &:hover {
    background-color: #4e0eff;
  }
}
`;



export default SetAvatar 