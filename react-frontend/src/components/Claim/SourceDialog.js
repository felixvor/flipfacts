import { Button, Dialog, DialogContent, Grid, IconButton, Link, makeStyles, Typography } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import React from "react"


const useStyles = makeStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }))


const SourceDialog = (props) =>{
    const classes = useStyles()
    console.log(props.source)
    if (props.source === null){
        return <></> //why am i here?
    }

    
    const reportSource = () => {
        props.report(props.source)
        props.handleClose()
    }

    return (
    <Dialog onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.open}>
        <MuiDialogTitle disableTypography>
                <Typography variant="h5">Inspect Source</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={props.handleClose}>
                    <CloseIcon />
                </IconButton>
        </MuiDialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
          <Link target="_blank" href={props.source.url}>{props.source["title"]}</Link>
          </Typography>


          <Typography gutterBottom>
            <ul>
                <li> Added by: {props.source.posted_by}</li>
                <li> Citations: {props.source.citations}</li>
                <li> Identifier: {props.source.identifier}</li>
            </ul>
          </Typography>
          <Grid container justify="center" style={{"paddingTop":"5px"}}>
              <Grid item>
              {props.loggedIn &&
                    <Button variant="contained" color="secondary" onClick={() => reportSource()}>
                        Report Bad Source
                    </Button>}
            </Grid>
            {/* <Grid item>
            <Button variant="contained" color="primary">
               Open on Scholar
            </Button>
            </Grid> */}
          </Grid>
        </DialogContent>
        {/* <DialogActions>
            <Button autoFocus onClick={props.handleClose} color="primary">
                Close
            </Button>
        </DialogActions> */}
      </Dialog>


    )
}

export default SourceDialog