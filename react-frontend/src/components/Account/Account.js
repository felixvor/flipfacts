import React from 'react'
import Grid from '@material-ui/core/Grid';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import TextField from '@material-ui/core/TextField';

import {PersonOutline as PersonOutlineIcon} from "@material-ui/icons"
import {Edit as EditIcon} from "@material-ui/icons"
import {Email as EmailIcon} from "@material-ui/icons"
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ClearIcon from '@material-ui/icons/Clear';



import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios';

import { useEffect } from "react";
import { IconButton, ListItemSecondaryAction, Tooltip } from '@material-ui/core';
import { useState } from 'react';
import { Helmet } from 'react-helmet';





const useStyles = makeStyles((theme) => ({
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(4),
      minHeight: "73vh",
    },
  }));

  

const Account = (props) => {
    
    const classes = useStyles();

    const [myUsername, setMyUsername] = useState("Loading...")
    const [myEmail, setMyEmail] = useState("Loading...")

    useEffect(() => {
        axios({
            method: 'get',
            url: `/api/profile`,
            }).then( (response)  => {
                //console.log(response.data)
                setMyUsername(response.data["username"])
                setMyEmail(response.data["email"])
            })
            .catch((error) => {
              console.log(error.response)
            });
    }, [])


    const [canEdit, setCanEdit] = useState(true)
    const [showingField, setShowingField] = useState(null)
    const resetShowingFields = () => {
        setUserNameValue("")
        setUserNameError(false)
        setUserNameHelp("Press Enter to submit.")
        //Email here
        setPasswordValue("")
        setPasswordError(false)
        setPasswordHelp("Press Enter to submit.")
        
        setRepPasswordValue("")
        setRepPasswordError(false)
        setRepPasswordHelp("Press Enter to submit.")
        
        setShowingField(null)
    }
    



    const [userNameValue, setUserNameValue] = useState("")
    const [userNameError, setUserNameError] = useState(false)
    const [userNameHelp, setUserNameHelp] = useState("Press Enter to submit.") //error text here
    const userNameInput = (e) => {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }
        if (e.key === "Escape") {
            setUserNameValue("")
            setShowingField(null)
        }
        if (e.key === "Enter") {
            //alert("set new username")
            postNewUsername(userNameValue)
        }
    }
    const postNewUsername = (username) => {
        setCanEdit(false)
        axios({
            method: 'put',
            url: `/api/profile/username`,
            data:{"name":username}
            }).then( (response)  => {
                //setCanEdit(true)
                window.location.reload(true)
            })
            .catch((error) => {
                setCanEdit(true)
                if(error.response.data === "username invalid"){
                    setUserNameValue("")
                    setUserNameError(true)
                    setUserNameHelp("Invalid username.")
                }
                if(error.response.data === "username exists"){
                    setUserNameError(true)
                    setUserNameHelp("User already exists.")
                }
            });
        
    }

    const [passwordValue, setPasswordValue] = useState("")
    const [passwordError, setPasswordError] = useState(false)
    const [passwordHelp, setPasswordHelp] = useState("Press Enter to submit.") //error text here
    const passwordInput = (e) => {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }
        if (e.key === "Escape") {
            setPasswordValue("")
            setShowingField(null)
        }
        if (e.key === "Enter") {
            setShowingField("passwordvalidate")
        }
    }

    const [repPasswordValue, setRepPasswordValue] = useState("")
    const [repPasswordError, setRepPasswordError] = useState(false)
    const [repPasswordHelp, setRepPasswordHelp] = useState("Press Enter to submit.") //error text here
    const repPasswordInput = (e) => {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }
        setRepPasswordError(false)
        setRepPasswordHelp("Press Enter to submit.")
        if (e.key === "Escape") {
            setPasswordValue("")
            setRepPasswordValue("")
            setShowingField(null)
        }
        if (e.key === "Enter") {
            if(repPasswordValue !== passwordValue){
                setRepPasswordError(true)
                setRepPasswordHelp("Passwords did not match.")
                return
            }
            postNewPassword(passwordValue)
            //submitChange("password")
        }
    }

    const postNewPassword = (password) => {
        setCanEdit(false)
        axios({
            method: 'put',
            url: `/api/profile/password`,
            data:{"password":password}
            }).then( (response)  => {
                //setCanEdit(true)
                window.location.reload(true)
            })
            .catch((error) => {
                setCanEdit(true)
                if(error.response.data === "password invalid"){
                    setShowingField("password")
                    setPasswordError(true)
                    setPasswordHelp("Bad Password")
                    setPasswordValue("")
                    setRepPasswordValue("")
                    return
                }
                window.location.reload(true)
            });
        
    }


    return (

        <div>
            <Helmet>
                <title>{`FlipFacts - Account`}</title>
                <meta name="description" content={`Edit your FlipFacts.net Account - Search and Find scientific sources for everyday assumptions on FlipFacts.net Search everyday thoughts and find relevant sources quick and easy. Create an account and post your own ideas and add new sources!`}/>
            </Helmet>
            <Container maxWidth="sm" className={classes.container} >
                <Grid item xs={12} md={12}>
                    <Card>
                        <CardContent>
                            <Grid container justify="center">                     
                                <Grid xs={12} sm={10} item style={{"paddingBottom":"40px"}}>
                                        <h1>Profile Settings</h1>  
                                    <List disablePadding>
                                        
                                        <ListItem>
                                            <ListItemIcon style={{"marginRight":"-15px"}}>
                                                <PersonOutlineIcon />
                                            </ListItemIcon>
                                            {showingField === "username" &&
                                                <>
                                                    <TextField style={{"marginRight":"50px"}}
                                                        fullWidth
                                                        autoComplete="username"
                                                        autoFocus
                                                        disabled={!canEdit}
                                                        error={userNameError}
                                                        helperText={userNameHelp}
                                                        label="Username"
                                                        placeholder={"New Username"}
                                                        required
                                                        type="text"
                                                        value={userNameValue}
                                                        variant="filled"
                                                        InputLabelProps={{ required: false }}
                                                        onKeyDown = {(e) => userNameInput(e)}
                                                        onChange={(e)=>setUserNameValue(e.target.value)}
                                                    />
                                                    <ListItemSecondaryAction>
                                                    <Tooltip title="Nevermind">
                                                    <div>
                                                        <IconButton onClick={ () => resetShowingFields() }>
                                                            <ClearIcon />
                                                        </IconButton>
                                                    </div>
                                                    </Tooltip>
                                                    </ListItemSecondaryAction>
                                                </>
                                            }
                                            {showingField !== "username" &&
                                            <>
                                            <ListItemText
                                                primary="Username"
                                                secondary={myUsername}
                                            />
                                            <ListItemSecondaryAction>
                                                <Tooltip title="Change">
                                                <div>
                                                    <IconButton
                                                    disabled={false}
                                                    onClick={ () => setShowingField("username") }
                                                    >
                                                    <EditIcon />
                                                    </IconButton>
                                                </div>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                            </>
                                            }
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon style={{"marginRight":"-15px"}}>
                                                <EmailIcon />
                                            </ListItemIcon>
                                            {showingField === "email" &&
                                                <>
                                                <TextField style={{"marginRight":"50px"}}
                                                    autoComplete="email"
                                                    autoFocus
                                                    disabled={!canEdit}
                                                    error={false}
                                                    fullWidth={false}
                                                    helperText={"Press Enter to sumbmit."}
                                                    label="E-mail address"
                                                    placeholder={"users current mail"}
                                                    required
                                                    type="email"
                                                    // value={"email state"}
                                                    variant="filled"
                                                    InputLabelProps={{ required: false }}
                                                    onKeyDown={(event) => 1+1}
                                                    onChange={(event) => 1+1}
                                                />
                                                <ListItemSecondaryAction>
                                                <Tooltip title="Nevermind">
                                                <div>
                                                    <IconButton onClick={ () => resetShowingFields() }>
                                                        <ClearIcon />
                                                    </IconButton>
                                                </div>
                                                </Tooltip>
                                                </ListItemSecondaryAction>
                                                </>
                                            }
                                            {showingField !== "email" &&
                                            <>
                                                <ListItemText
                                                    primary="E-Mail Adress"
                                                    secondary={myEmail}
                                                />
                                                <ListItemSecondaryAction>
                                                    <Tooltip title="Not editable at the moment">
                                                    <div>
                                                        <IconButton
                                                        disabled={true}
                                                        onClick={ () => setShowingField("email") }
                                                        >
                                                        <EditIcon />
                                                        </IconButton>
                                                    </div>
                                                    </Tooltip>
                                                </ListItemSecondaryAction>
                                            </>
                                            }
                                            
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon style={{"marginRight":"-15px"}}>
                                                <VpnKeyIcon />
                                            </ListItemIcon>
                                            {showingField === "password" &&
                                                <>
                                                    <TextField style={{"marginRight":"50px"}}
                                                        autoComplete="new-password"
                                                        autoFocus
                                                        disabled={!canEdit}
                                                        error={passwordError}
                                                        helperText={passwordHelp}
                                                        label="Password"
                                                        placeholder={"New Password"}
                                                        required
                                                        type="password"
                                                        value={passwordValue}
                                                        variant="filled"
                                                        InputLabelProps={{ required: false }}
                                                        onKeyDown={(e) => passwordInput(e)}
                                                        onChange={(e)=>setPasswordValue(e.target.value)}
                                                    />
                                                    <ListItemSecondaryAction>
                                                    <Tooltip title="Nevermind">
                                                    <div>
                                                        <IconButton onClick={ () => resetShowingFields() }>
                                                            <ClearIcon />
                                                        </IconButton>
                                                    </div>
                                                    </Tooltip>
                                                    </ListItemSecondaryAction>
                                                </>
                                            }
                                            {showingField === "passwordvalidate" &&
                                                <>
                                                    <TextField style={{"marginRight":"50px"}}
                                                        autoComplete="new-password"
                                                        autoFocus
                                                        disabled={false}
                                                        error={repPasswordError}
                                                        helperText={repPasswordHelp}
                                                        label="Repeat"
                                                        placeholder={"Repeat"}
                                                        required
                                                        type="password"
                                                        value={repPasswordValue}
                                                        variant="filled"
                                                        InputLabelProps={{ required: false }}
                                                        onKeyDown={(e)=>repPasswordInput(e)}
                                                        onChange={(e)=>setRepPasswordValue(e.target.value)}
                                                    />
                                                    <ListItemSecondaryAction>
                                                    <Tooltip title="Nevermind">
                                                    <div>
                                                        <IconButton onClick={ () => resetShowingFields() }>
                                                            <ClearIcon />
                                                        </IconButton>
                                                    </div>
                                                    </Tooltip>
                                                    </ListItemSecondaryAction>
                                                </>
                                            }
                                            {showingField !== "password" && showingField !== "passwordvalidate" &&
                                            <>
                                            <ListItemText
                                                primary="Password"
                                                secondary={
                                                    "••••••••••"
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <Tooltip title="Change">
                                                <div>
                                                    <IconButton
                                                    disabled={false}
                                                    onClick={ () => setShowingField("password") }
                                                    >
                                                    <EditIcon />
                                                    </IconButton>
                                                </div>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                            </>
                                            }
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Container>
        </div>
    )
}

export default Account
