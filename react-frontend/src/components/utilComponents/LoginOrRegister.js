import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import { Link as RouteLink } from "react-router-dom"
import Link from '@material-ui/core/Link';


// const useStyles = makeStyles((theme) => ({

//   }));

const LoginOrRegister = (props) => {
    //const classes = useStyles();
    const redirectPathB64 = btoa(props.redirectAfter);
    return (
      <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <Typography>Please 
                    &nbsp;<RouteLink style={{ textDecoration: 'none' }} to={"/login?redirect="+redirectPathB64}><Link>Login</Link></RouteLink>&nbsp;
                    or  
                    &nbsp;<RouteLink style={{ textDecoration: 'none' }} to={"/register?redirect="+redirectPathB64}><Link>Create an Account</Link></RouteLink>&nbsp;
                    to {props.purpose}.</Typography>
            </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="contrast">
                Nevermind
            </Button>
        </DialogActions>
    </Dialog>
    )
}

export default LoginOrRegister
