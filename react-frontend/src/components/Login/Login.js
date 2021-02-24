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
import {useHistory} from 'react-router-dom';


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



const Login = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [wrongPassword, setWrongPassword] = useState(false)
  const [wrongEmail, setWrongEmail] = useState(false)

  // is user coming from a page that asked him to login for an action? lead him back afterwards
  const queryParams = new URLSearchParams(window.location.search);
  const redirParam = queryParams.get("redirect")
  const redirect = (redirParam && redirParam.length > 0?redirParam:null)

  const onLogin = (e) =>{
    e.preventDefault()

    const formData = new FormData(e.target);
    var object = {};
    formData.forEach((value, key) => object[key] = value);

    if (object["remember"]){
      object["remember"] = true //api endpoint expects boolean
    }else{
      object["remember"] = false
    }
    
    axios({
      method: 'post',
      url: '/api/login',
      data: JSON.stringify(object),
      headers: {'Content-Type': 'application/json' }
      }).then( (response)  => {
          
          if(response.status === 200){
            props.loginSuccess(redirect)
            history.push('/')
          }
      })
      .catch((error) => {
        console.log(error)
        if(!error.response){
          alert("Something went wrong")
          return
        }
        if(error.response.data === "Invalid Email"){
          setWrongEmail(true)
          setWrongPassword(false)
        }
        if(error.response.data === "Invalid Password"){
          setWrongPassword(true)
          setWrongEmail(false)
        }
      });

  }

  return (
  <Container component="main" maxWidth="xs" style={{"min-height":"73vh"}}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={(e) => onLogin(e)}>
          <TextField
            error={wrongEmail}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            error={wrongPassword}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            type="checkbox"
            name="remember"
            id="remember"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid>
            <Grid item>
            <RouteLink to="register" style={{ textDecoration: 'none' }}>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
              </RouteLink>
            </Grid>
            <Grid item>
            <RouteLink to="recover" style={{ textDecoration: 'none' }}>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </RouteLink>
            </Grid>
          </Grid>
        </form>
      </div>
  </Container>
  );
}

export default Login