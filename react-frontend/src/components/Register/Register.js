import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { Link as RouteLink } from "react-router-dom"
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useHistory} from 'react-router-dom';

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
  const history = useHistory();

  const [badUser, setBadUser] = useState(false)
  const [badMail, setBadMail] = useState(false)
  const [badPassword, setBadPassword] = useState(false)
  const [badPasswordRepeat, setBadPasswordRepeat] = useState(false)
  
  const [waitForMailSent, setWaitForMailSent] = useState(false)
  const [mailSent, setMailSent] = useState(false)
  const [mailAddress, setMailAddress] = useState("")
  const [badVerificationCode, setBadVerificationCode] = useState(false)

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

    setMailAddress(object["email"])
    
    setWaitForMailSent(true)

    axios({
      method: 'post',
      url: '/api/register',
      data: JSON.stringify(object),
      headers: {'Content-Type': 'application/json' }
      })
      .then(function (response) {
          console.log(response)
          setMailSent(true)
      })
      .catch(function (error) {
          if(error.response.data === "username invalid"){
            setBadUser(true)
          }
          if(error.response.data === "username exists"){
            setBadUser(true)
          }
          if(error.response.data === "email invalid"){
            setBadMail(true)
          }
          if(error.response.data === "already logged in"){
            document.location.href="/";
          }
          setWaitForMailSent(false)
          console.log(error.response);
      });
  }


  const onVerify = (e) =>{
    e.preventDefault()
    setBadVerificationCode(false)

    const formData = new FormData(e.target);
    var object = {};
    formData.forEach((value, key) => object[key] = value.trim());

    axios({
      method: 'post',
      url: '/api/mailverify',
      data: JSON.stringify(object),
      headers: {'Content-Type': 'application/json' }
      })
      .then(function (response) {
          console.log(response)
          // TODO: show user that register was successful!
          const urlParams = new URLSearchParams(window.location.search);
          history.push('/login?'+urlParams)
          //document.location.href="/login";
      })
      .catch(function (error) {
          if(error.response.data === "bad verification code"){
            setBadVerificationCode(true)
          }
          console.log(error.response);
      });

  }

  const registerForm = (
    <form className={classes.form} onSubmit={(e) => onRegister(e)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={badUser}
                  autoComplete="Username"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  helperText={badUser?"Username invalid or already registered.":null}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={badMail}
                  variant="outlined"
                  required
                  fullWidth
                  type="email"
                  id="email"
                  label="Email Address"
                  name="email"
                  helperText={badMail?"E-Mail Address invalid or already registered.":null}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  error={badPassword}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  helperText={badPassword?"Password must have at least 8 characters.":null}
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  error={badPasswordRepeat}
                  required
                  fullWidth
                  name="passwordrepeat"
                  label="Repeat Password"
                  type="password"
                  helperText={badPasswordRepeat?"Passwords do not match.":null}
                  id="passwordrepeat"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I accept."
                />
              </Grid> */}
            </Grid>
            <br/>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={waitForMailSent}
            >
              {waitForMailSent?"Processing...":"Sign Up"}
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <RouteLink to="/login" style={{ textDecoration: 'none' }}>
                  <Link variant="body2">
                    Already have an account? Sign in
                  </Link>
                </RouteLink>
              </Grid>
            </Grid>
          </form>
  )

  const mailVerifyForm = (
    <form className={classes.form} onSubmit={(e) => onVerify(e)}>

      <Typography>
        Verification was sent to <i> {mailAddress}</i> 
      </Typography>
      <Typography variant="">
        (please check the spam folder)
      </Typography>
      
      <br/>
      <br/>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={badVerificationCode}
            name="mail_verification_code"
            variant="outlined"
            required
            fullWidth
            id="mail_verification_code"
            label="Enter Verification Code"
            helperText={badVerificationCode?"Verification Code is not valid.":null}
            autoFocus
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Verify
      </Button>
    </form>
  )




  return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <main>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          { mailSent ? mailVerifyForm : registerForm }
        </div>
      </main>
    </Container>
  );
}

export default Register