import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';

import { useHistory } from "react-router-dom"

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import LoginOrRegister from "../utilComponents/LoginOrRegister"
import AssumptionCard from "../utilComponents/AssumptionCard"
import SearchBar from "../utilComponents/SearchBar"


import axios from 'axios';



const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

const motds = ["Find scientific sources for your shower thoughts.", 
        "Find and rate assumptions with scientific sources.", 
        "Your place to check if you had the right idea.", 
        //"Don't trust the tabloids? You are at the right place.",
        "Assumptions rated with scientific sources.",
        //"We think voting with credible sources is better than just voting.",
        //"Not in favor of Science-Fake-News since 2021."
      ]

const Home = (props) => {
  const classes = useStyles();
  const history = useHistory(); 
  const [loginOrRegisterShow, setLoginOrRegisterShow] = useState(false)
  const [recentAssumptions, setRecentAssumptions] = useState(null)
  const [motd, setMotd] = useState(null)

  useEffect(
    () => {
      axios({
        method: 'get',
        url: '/api/assumption/recent',
        }).then( (response)  => {
            console.log(response.data)
            setRecentAssumptions(response.data)
        })
        .catch((error) => {
          console.log(error.response)
        });
      }, [])

  const newPostClickHandler = () =>{
    if (props.loggedIn){
      history.push("/new")
    }else{
      setLoginOrRegisterShow(true)
    }
  }
  if(motd === null){
    setMotd(motds[Math.floor(Math.random() * motds.length)])
  }

  return (
    <React.Fragment>
      <LoginOrRegister
        open={loginOrRegisterShow}
        title={<>Account needed</>}
        purpose={<>post a new assumption</>}
        handleClose={() => setLoginOrRegisterShow(false)}
        redirectAfter={"/new"}
      />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              FlipFacts
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              {motd}
            </Typography>

            <div className={classes.heroButtons}>
              <SearchBar/>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">

        <Typography component="h2" variant="h4" align="center" color="textSecondary" gutterBottom>
          Recently Updated:
        </Typography>
        <br/>
        <br/>
          <Grid container spacing={4}>
            {recentAssumptions?(recentAssumptions.map((assumption) =>
               <AssumptionCard key={assumption.id}
                               id={assumption.id}
                               text={assumption.text}
                               datePosted={assumption.datePosted}
                               author={assumption.author}
                               positiveSources={assumption.positiveSources}
                               negativeSources={assumption.negativeSources}
                               />
                              )):(<h2>Loading...</h2>)}
            <Grid item xs={12} sm={12} md={12}>
              <Button onClick={()=> newPostClickHandler()} variant="outlined" style={{"paddingLeft":"50px", "paddingRight":"50px"}}>post new assumption</Button>
            </Grid>

          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}

export default Home