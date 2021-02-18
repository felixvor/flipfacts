import React, {useState,  useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import axios from 'axios';
import { useParams } from "react-router-dom";
import { Divider, Grid, Typography } from '@material-ui/core';
import SearchBar from '../utilComponents/SearchBar';
import AssumptionCard from '../utilComponents/AssumptionCard';


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
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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


  return (
  <Container component="main" maxWidth="md">
        <div>
          <Container maxWidth="md" style={{"paddingTop":"75px"}}>
            <Grid container justify="center">
            <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
              Assumption Search:
            </Typography>
            <Grid item md={8} xs={11}>
              <SearchBar initialValue={query}/>
            </Grid>
            </Grid>
          </Container>
          <Container className={classes.cardGrid} maxWidth="md">
            <Divider variant="middle"/>
            <br/>
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