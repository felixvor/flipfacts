import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';




const useStyles = makeStyles((theme) => ({
    footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(4),
    },
  }));
  
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://bratp.fun/">
            FlipFacts
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        </Typography>
    );
}

export default function Footer() {

    const classes = useStyles();

    return (
        <div>
            {/* Footer */}
            <footer className={classes.footer}>
                <Typography variant="h5" align="center" gutterBottom>
                FlipFacts
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    My very first public web-project - Feel free to criticize!
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    • <Link href="/about">About</Link> • <Link href="/about#datausage">Data Usage</Link> • <Link href="/about#contact">Contact</Link> • 
                </Typography>
                <br/>
                <Copyright />
            </footer>
            {/* End footer */}
        </div>
    )
}
