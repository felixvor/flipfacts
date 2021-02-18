import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import { Link as RouteLink } from "react-router-dom"
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import axios from 'axios';





const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(14),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = () => {
  const classes = useStyles();

  const [badUser, setBadUser] = useState(false)
  const [badMail, setBadMail] = useState(false)
  const [badPassword, setBadPassword] = useState(false)
  const [badPasswordRepeat, setBadPasswordRepeat] = useState(false)

  const onRegister = (e) =>{
    e.preventDefault()

    setBadUser(false)
    setBadMail(false)
    setBadPassword(false)
    setBadPasswordRepeat(false)

    const formData = new FormData(e.target);
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    if(object["password"] !== object["passwordrepeat"]){
      setBadPasswordRepeat(true)
      return
    }

    // Input Field Validations:
    if (object["name"].length < 3 || object["name"].length >= 35){
      setBadUser(true)
      return
    }
    if (object["email"].length < 3 || object["name"].length >= 200){
      setBadMail(true)
      return
    }
    if (object["password"].length < 8 || object["password"].length >= 40){
      setBadPassword(true)
      return
    }

    delete object["passwordrepeat"]
    
    axios({
      method: 'post',
      url: '/api/register',
      data: JSON.stringify(object),
      headers: {'Content-Type': 'application/json' }
      })
      .then(function (response) {
          //handle success
          console.log(response);
      })
      .catch(function (error) {
          if(error.response.data === "username invalid"){
            setBadUser(true)
          }
          if(error.response.data === "email invalid"){
            setBadMail(true)
          }
          console.log(error.response);
      });
  }

  return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <main>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1">
            Enter E-Mail Verification Code:
          </Typography>

        </div>
      </main>
    </Container>
  );
}

export default Register