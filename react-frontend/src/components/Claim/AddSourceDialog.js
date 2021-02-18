import { Dialog, TextField, DialogContent, DialogContentText, DialogActions, Button, DialogTitle, Grid, List, ListItem, ListItemText, Popover, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import React from "react"
import LoginOrRegister from "../utilComponents/LoginOrRegister";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';



const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(15),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    sourceItem: {
        '&:hover': {
            "cursor": 'pointer',
          }
      },
    denseListItem:{
        marginTop:"0px",
        marginBottom:"3px",
        paddingTop:"0px",
        paddingBottom:"0px"
    },
    cardGrid:{
        paddingTop:"55px",
        padding:"20px"
    }
  }));


const AddSourceDialog = (props) => {

    // props.supportive = True/False
    // props.open = True/False
    // props.loggedIn

    const classes = useStyles();


    const [popoverPos, setPopoverPos] = React.useState(null);
    const [addSourceHelper, setAddSourceHelper] = React.useState(null)
    const open = Boolean(popoverPos);

    const submitSource = (e) => {
        e.preventDefault()
        setAddSourceHelper(null)
        const formData = new FormData(e.target);
        let object = {};
        formData.forEach((value, key) => object[key] = value);
        if(props.supportive){
            object["type"] = "positive"
        } else {
            object["type"] = "negative"
        }

        // Client Side Publication Verify before sending to server:
        axios({
            method: 'get',
            url: `https://api.semanticscholar.org/v1/paper/${object["identifier"]}`,
            }).then( (response)  => {
                console.log(response)
                if (response.data.citations.length < 7){
                    setAddSourceHelper("Publication does not seem to be relevant. Look for a source with a higher citation count.")
                    return
                }
                console.log("Posting to flask")
                // Publication seems to exist, send to server. (If server receives non existing IDs, we know user is bypassing frontend...)
                axios({
                    method: 'post',
                    url: `/api/assumption/${props.assumptionId}/source`,
                    data: JSON.stringify(object),
                    headers: {'Content-Type': 'application/json' }
                    }).then( (response)  => {
                        console.log(response)
                        props.handleClose()
                        window.location.reload(true)
                    })
                    // Error of Backend
                    .catch((error) => {
                        if(error.response.data === "source already in list"){
                            setAddSourceHelper("Source already in list.")
                            return
                        }else{
                            //"invalid identifier" or "not enough citations" bypassed
                            setAddSourceHelper("Please contact the developer.")
                        }
                    console.log(error.response)
                });
            })
            // Error of SemanticScholar Lookup
            .catch((error) => {
                if(error.response && error.response.status === 404){
                    setAddSourceHelper("Publication not found.")
                    return
                } else {
                    setAddSourceHelper("Network error.")
                    return
                }
            }
        );  
    }

    let addSourceDialog = null;
    if (props.loggedIn === false){
        addSourceDialog = <LoginOrRegister 
                                open={props.open}
                                title={<>Add a source that {props.supportive?"supports":"contradicts"} this claim</>}
                                purpose={"add a source"}
                                handleClose={props.handleClose}
                                redirectAfter={"/claims/"+props.assumptionId}
                            />
    }else{
        addSourceDialog = ( 
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <form onSubmit={(e) => submitSource(e)}>
            <DialogTitle id="form-dialog-title">Add a source that {props.supportive?"supports":"contradicts"} this claim</DialogTitle>
                <DialogContent>
                    <Grid item container>
                    <Typography>
                        Type or paste a valid Publication Identifier
                    </Typography>
                        <HelpOutlineIcon style={{"marginRight":"4px"}} fontSize="small" onClick={(e) => setPopoverPos(e.currentTarget)}/>
                        <Popover 
                            anchorEl={popoverPos}
                            open={open}
                            onClose={() => setPopoverPos(null)}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            >
                                {/* <Grid item className={classes.helpPopover}> */}   
                                    <List dense className={classes.denseListItem}>
                                        <ListItem className={classes.denseListItem}>
                                            <h3>Supported Identifiers:</h3>
                                        </ListItem>
                                        <ListItem className={classes.denseListItem}>
                                            <ListItemText className={classes.denseListItem}
                                                primary="• DOI"
                                                secondary="10.1038/xyz3241 or 10.1177/0956797619892892"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.denseListItem}>
                                            <ListItemText className={classes.denseListItem}
                                                primary="• arXiv"
                                                secondary="arXiv:1810.04805"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.denseListItem}>
                                            <ListItemText className={classes.denseListItem}
                                                primary="• PubMed ID"
                                                secondary="PMID:31809229"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.denseListItem}>
                                            <ListItemText className={classes.denseListItem}
                                                primary="• S2 Paper ID"
                                                secondary="0796f6cd7f0403a854d67d525e9b32af3b277331"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.denseListItem}>
                                            <ListItemText className={classes.denseListItem}
                                                primary="• MAG ID"
                                                secondary="MAG:112218234"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.denseListItem}>
                                            <ListItemText className={classes.denseListItem}
                                                primary="• ACL ID"
                                                secondary="ACL:W12-3903"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.denseListItem}>
                                            <ListItemText className={classes.denseListItem}
                                                primary="• Corpus ID"
                                                secondary="CorpusID:62543295"
                                            />
                                        </ListItem>
                                    </List>
                                {/* </Grid> */}
                            </Popover>
                    <Typography >
                        into the text box below.
                    </Typography>
                    </Grid>
                    <TextField
                        autoFocus
                        error={addSourceHelper != null}
                        helperText={addSourceHelper}
                        margin="dense"
                        name="identifier"
                        id="identifier"
                        label="Publication Identifier"
                        type="text"
                        fullWidth
                    />
                    <DialogContentText variant= 'caption'>
                        Please double check that your source is relevant and actually {props.supportive?"supporting":"contradicting"} the given claim.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="contrast">
                        Submit
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
        )
    }
    return addSourceDialog
}

export default AddSourceDialog