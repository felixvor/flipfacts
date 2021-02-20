import React, {useState,  useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { Divider, Grid, Link, Paper, Typography } from '@material-ui/core';
import SearchBar from '../utilComponents/SearchBar';
import AssumptionCard from '../utilComponents/AssumptionCard';

import InfoIcon from '@material-ui/icons/Info';
import LoginOrRegister from '../utilComponents/LoginOrRegister';


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
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  newSourceLink: {
    '&:hover': {
        "cursor": 'pointer',
      }
  },
}));



const Search = (props) => {

    const classes = useStyles();
    let { b64query = null } = useParams();
    const query = b64query?atob(b64query):null

    const [searchResults, setSearchResults] = useState(null)

    useEffect(() => {
        if (query === null){
            return
        }
        window.scrollTo(0, 0)
        axios({
            method: 'post',
            url: `/api/search`,
            data: JSON.stringify({"query":query}),
            headers: {'Content-Type': 'application/json' }
            }).then( (response)  => {
                console.log(response.data)
                setSearchResults(response.data)
            })
            .catch((error) => {
              console.log(error.response)
            });
    }, [query])

    const history = useHistory(); 
    const [loginOrRegisterShow, setLoginOrRegisterShow] = useState(false)

    const newPostClickHandler = () =>{
      if (props.loggedIn){
        history.push("/new")
      }else{
        setLoginOrRegisterShow(true)
      }
    }

  return (
  <Container component="main" maxWidth="md">
        <LoginOrRegister
          open={loginOrRegisterShow}
          title={<>Account needed</>}
          purpose={<>post a new assumption</>}
          handleClose={() => setLoginOrRegisterShow(false)}
          redirectAfter={"/new"}
      />
        <div>
          <Container maxWidth="md" style={{"paddingTop":"75px"}}>
            <Grid container justify="center">
              <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
                Semantic Search:
              </Typography>
              <Grid item md={9} xs={11} style={{"paddingBottom":"15px"}}>
                <SearchBar initialValue={query}/>
              </Grid>

              {searchResults !== null && searchResults.length > 0 &&
                <Grid item sm={7}>
                  <Paper elevation={1} style={{"padding":"8px"}}>
                    <InfoIcon fontSize="small" />
                    <Typography variant="caption text">
                        Results are ordered by thematic similarity. If you dont't find what your are looking for you can always <Link className={classes.newSourceLink} onClick={()=>newPostClickHandler()}>add your own assumption</Link> to the list.
                    </Typography>
                  </Paper>
                  <br/>
              </Grid>}

            </Grid>      
          </Container>
          <Container className={classes.cardGrid} maxWidth="md">
            <Divider variant="middle"/>
            <br/>
              <Grid container spacing={4} justify="center">
                  {searchResults !== null && searchResults.map((assumption) => <AssumptionCard key={assumption.id} {...assumption}/>)}
                  {searchResults !== null && searchResults.length === 0 && <h2>No results found.</h2>}
              </Grid>
          </Container>
        </div>

  </Container>
  );
}

export default Search