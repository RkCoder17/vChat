import Swal from 'sweetalert2'
import React, { useState, useEffect} from 'react'
import styled from "styled-components"
import { Link, useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';
import SetAvatar from './SetAvatar';
import Logo from "../assets/chat-icon.jpg"
// import { getAutoCloseDelay } from 'react-toastify/dist/utils';
  

const Register = () => {
  
  const navigate = useNavigate() 
  const [values, setValues]= useState({
    username: "",
    email: "",
    password: "",
    cPassword: "",
  }); 

  const toastOptions = {
    position:"bottom-right",
    autoClose : 8000,
    pauseOnHover : true,
    draggable :  true,
    theme : "dark",
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation())
    {
     const {password, cPassword, username, email} = values;
     const {data} = await axios.post(registerRoute,
      {
        username,
        email,
        password,
      });
     if(data.status===false)
     {
      toast.error(data.msg, toastOptions);
     }
     if(data.status === true)
     {
      localStorage.setItem('chat-app-user',JSON.stringify(data.user));
      navigate("/setAvatar"); 
    }
    }
  };

  const handleValidation = () => {
    const {password, cPassword, username, email } = values;
     
    if (username.length < 3  || username.length > 15 ) {
      toast.error("Username should be between 3 to 15 characters", toastOptions );
      return false;
    }
    else if(email==="")
      {
        toast.error("Email is Required", toastOptions );
      return false;
      } 
    else if (password.length < 8) {
      toast.error("Password should be equal to or greater than 8 characters", toastOptions );
      return false;
    }
    else if (password != cPassword) {
      toast.error("Password and Confirm Password Should be Same.", toastOptions );
      return false;
  }
  Swal.fire(
    'User Registered',
    `${username} Registered Successfully !!!`,
    'success'
  )
            return true;
  }

  const handleChange = (event) => {
  setValues({ ...values, [event.target.name]: event.target.value });
  };
  
  return (
    <>
    <FormContainer>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className='brand'>
        <img src={Logo} alt="logo" />
        <h1><small>v</small>C<small>hat</small></h1>
        </div>
        <input type="text"
        placeholder="Username"
        name="username"
        onChange={(e) => handleChange(e)}
          />
         <input type="email"
         placeholder="Email"
         name="email"
         onChange={(e) => handleChange(e)}
         />
         <input type="password"
         placeholder="Password"
         name="password"
         onChange={(e) => handleChange(e)}
         />
          <input type="password"
           placeholder="Confirm Password"
               name="cPassword"
               onChange={(e) => handleChange(e)}
               />
               <button type="submit">Create User</button>
               <span>
                Already have an account ? <Link to="/login">Login</Link>
               </span>
        </form> 
    </FormContainer>
    <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
height : 100vh;
width : 230vh;
display :flex;
flex-direction: column;
justify-content: center;
gap : 1rem;
align-items: center;
background-color: #131324;
.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  img {
    height: 3rem;
  }
  h1 {
    color:white;
    text-transform: uppercase;
  }
}
form {
  display:flex;
  flex-direction: column;
  gap: 2rem;
  background-color:#00000076;
  border-radius: 2rem;
  padding: 3rem 5rem;
  input {
  background-color: transparent;
  padding: 1rem;
  border: 0.1rem solid #4e0eff;
  border-radius: 0.4rem;
  color: white;
  width: 100%;
  font-size: 1rem;
   &focus {
    border: 0.1rem solid #997af0;
    outline: none;
   }
  }
  button{
    background-color: #0c88f5;
    color: white;
    padding 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #0216f0;
    }
  }
  span {
     color : white;
     text-transform: uppercase;
     a{ 
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
     }
  }
}
`;

export default Register