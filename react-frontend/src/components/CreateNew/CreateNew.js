import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LabelImportantOutlinedIcon from '@material-ui/icons/LabelImportantOutlined';

import axios from 'axios';
import {useHistory} from 'react-router-dom';


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
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
    },
    //style for font size
    resize:{
      fontSize:20,
      lineHeight:1.2,
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    listIcon: {
        paddingRight:"5px"
      },
    listText: {
        marginLeft:"20px"
    },
    // sourceItem: {
    //     '&:hover': {
    //         "cursor": 'pointer',
    //       }
    //   },
  }));


const CreateNew = (props) => {

    const history = useHistory();

    const [invalidAssumption, setInvalidAssumption] = useState(false)
    const [helperText, setHelperText] = useState("Weak assumptions may be subject to moderation.")

    const assumptionSubmit = (e) => {
        e.preventDefault()

        setInvalidAssumption(false)
        setHelperText("Weak assumptions may be subject to moderation.")

        const formData = new FormData(e.target);
        let object = {}
        formData.forEach((value, key) => object[key] = value.trim());
        
        if (object["assumptionText"].split("\n").length > 2 || object["assumptionText"].length > 512 || object["assumptionText"].length < 10){
            setInvalidAssumption(true)
            setHelperText("You can do better.")
            return
        }

        axios({
            method: 'post',
            url: '/api/assumption/create',
            data: JSON.stringify(object),
            headers: {'Content-Type': 'application/json' }
            }).then( (response)  => {
                if(response.status === 200){
                  // do sth
                  let claimId = response.data
                  history.push(`/claims/${claimId}`)
                }
            })
            .catch((error) => {
              console.log(error)
              if(!error.response){
                alert("Something went wrong")
                return
              }
              if(error.response.data === "Invalid XYZ"){
                //do sth
              }
        });
    }
    
    // const claimId = props.match.params.id
    const classes = useStyles();

    return (
        <div>   
            <Container maxWidth="md" className={classes.container}>
                <Grid container justify="center">
                    <Grid item container xs={12} >
                        <Card >
                            <CardContent>
                                 <Typography variant="h6">Good assumptions are focused, specific and researchable.</Typography>
                                 <br/>
                                 <Grid container spacing={2} justify="center">
                                    <List dense>
                                        {/* <ListItem>
                                            <LabelImportantOutlinedIcon className={classes.listIcon}/>
                                            <ListItemText  className={classes.listText}
                                                primary="It must be easy to understand and unambiguous."
                                                secondary="Don't look for dissertation titles but ."
                                            />
                                        </ListItem> */}
                                        <ListItem>
                                            <LabelImportantOutlinedIcon className={classes.listIcon}/>
                                            <ListItemText className={classes.listText}
                                                primary="It must be possible to falsify."
                                                secondary="It should be easy to think of observations or examples that would proof the statement is wrong."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <LabelImportantOutlinedIcon className={classes.listIcon}/>
                                            <ListItemText className={classes.listText}
                                                primary="All the terms you use must have clear definitions."
                                                secondary="It should not be possible to interpret your statement (i.e. parts of it) one way or another."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <LabelImportantOutlinedIcon className={classes.listIcon}/>
                                            <ListItemText className={classes.listText}
                                                primary="It must depend on transparent, identifiable variables that are not subject to personal opinion."
                                                secondary="Your statement should directly imply ways to objectively measure influencing factors their effects."
                                            />
                                        </ListItem>
                                        {/* <ListItem>
                                            <LabelImportantOutlinedIcon className={classes.listIcon}/>
                                            <ListItemText className={classes.listText}
                                                primary="Don't polarize."
                                                secondary="."
                                            />
                                        </ListItem> */}
                                    </List>
                                </Grid>
                                <br/>
                                <form onSubmit={(e) => assumptionSubmit(e)}>
                                    <Grid container spacing={2} justify="center">
                                        <Grid item sm={5} xs={12} paper>
                                            <Typography><u>Positive Example:</u></Typography>
                                            <Typography><i>Low-cost airlines are more likely to have delays than premium airlines.</i></Typography>
                                        </Grid>
                                        <Grid item sm={5} xs={12} paper>
                                            <Typography><u>Negative Example:</u></Typography>
                                            <Typography><i>Ladybugs are a good natural pesticide.</i></Typography>
                                        </Grid>
                                        <Grid item md={8} sm={10} xs={12}>
                                        
                                        <Typography>Your Assumption:</Typography>
                                        <TextField
                                            id="with-placeholder"
                                            error={invalidAssumption}
                                            className={classes.textField}
                                            placeholder=""
                                            name="assumptionText"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            rowsMax={6}
                                            variant="outlined"
                                            InputProps={{
                                                classes: {
                                                input: classes.resize,
                                                },
                                            }}
                                            margin="normal"
                                            helperText={helperText}
                                            autoFocus={true}/>
                                        </Grid>
                                    </Grid>
                                    <Button type="submit" variant="contained" color="primary">Accept Conditions and Submit</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </Container>
        </div>
    )
}

export default CreateNew
