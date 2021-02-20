import React , { useEffect } from 'react';


import axios from 'axios';
import {useHistory} from 'react-router-dom';
import { Container } from '@material-ui/core';




const Logout = (props) => {

  const history = useHistory();

  const logout = () => {
    axios({
        method: 'post',
        url: '/api/logout',
        headers: {'Content-Type': 'application/json' }
        })
        .then(function (response) {
            console.log(response);
            //handle success
            if(response.status === 200){
                props.logoutSuccess()
                history.push('/')
            }
        })
        .catch(function (error) {
            //handle error
            console.log(error.response);
        });
    }

  useEffect(() => {
    setTimeout(logout, 1000);
   })
    
  return (
    <Container style={{"paddingTop":"85px"}}>
        <h4>Logging Out...</h4>
    </Container>
  );
}

export default Logout