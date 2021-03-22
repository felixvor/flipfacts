import { Dialog, DialogContent, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import TodayIcon from '@material-ui/icons/Today';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from "react"
import assumptionScore from "../utilComponents/AssumptionScore";



const useStyles = makeStyles((theme) => ({
    // dialog: {
    //     minWidth:"70vw",
    //     maxWidth:"70vw"
    // },
    list: {
        //width: "356px",
        overflow: "hidden",
        width: '100%',
        maxWidth: 420,
        backgroundColor: theme.palette.background.paper,
      },
  }));


const InfoDialog = (props) => {

    // props.supportive = True/False
    // props.open = True/False
    // props.loggedIn

    const classes = useStyles();

    console.log(props.assumption)

    return ( 
        <Dialog  open onClose={props.handleClose} aria-labelledby="form-dialog-title" maxWidth={"xs"} fullWidth>
        {/* <DialogTitle id="form-dialog-title">Assumption Information</DialogTitle> */}
            <DialogContent>
            <List className={classes.list}>
                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <TodayIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Date Posted" secondary={`${props.assumption.datePosted}`} />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <AccountCircleIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`Posted by`} 
                    secondary={`${props.assumption.author}`} />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <VisibilityIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Views" secondary={`${props.assumption.views}`} />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                    <Avatar>
                        <ThumbsUpDownIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Current validity" 
                    secondary={`${assumptionScore(props.assumption.positiveSources, props.assumption.negativeSources).toFixed(2)}%
                    based on ${props.assumption.positiveSources.length + props.assumption.negativeSources.length} sources.
                    `} />
                </ListItem>
                </List>
            </DialogContent>
            {/* <DialogActions>
                    <Button onClick={props.handleClose}>
                        Close
                    </Button>
                </DialogActions> */}
        </Dialog>
    )

}

export default InfoDialog