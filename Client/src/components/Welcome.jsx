import styled from 'styled-components'
import Robot from "../assets/Hi.gif"
import React, {useState,useEffect} from 'react'; 


const Welcome = ({ currentUser }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);

  useEffect (() =>   { 
    if(currentUser) {
setCurrentUserName(currentUser.username);
}
}, [currentUser]);


return (
<Container>
    <img src={Robot} alt="Robot" />
    <h1>Hi, <span> {currentUserName} ! </span></h1>
    <h3>Please Select a chat to Start Messaging</h3>
</Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcome