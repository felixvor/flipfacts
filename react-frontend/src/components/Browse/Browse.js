import React , { useEffect, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import AssumptionCard from "../utilComponents/AssumptionCard"


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      },
  }));
  

const Browse = (props) => {

    const [maxPages, setMaxPages] = useState(1)
    const [assumptions, setAssumptions] = useState(null)

    const loadPage = (page) => {
        axios({
            method: 'get',
            url: '/api/assumption/top/'+page,
            }).then( (response)  => {
                  console.log(response.data)
                  setMaxPages(response.data["maxPages"])
                  setAssumptions(response.data["assumptions"])
            })
            .catch((error) => {
              console.log(error.response)
            });

    }

    useEffect(() => {
        loadPage(1)        
    }, [])

    const handleChangePage = (e, page) => {
        loadPage(page)
    } 

    const classes = useStyles();
    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container justify="center">
                <h1>Browse</h1>
                <Grid container spacing={4}>
                    {assumptions?(assumptions.map((assumption) => <AssumptionCard key={assumption.id} {...assumption}/>)):(<h2>Loading...</h2>)}
                </Grid>
                <Grid item style={{"paddingTop":"20px"}}>
                    {/* add "disabled" while loading */}
                    <Pagination count={maxPages} showLastButton showFirstButton onChange={(e, page) => handleChangePage(e, page)}/> 
                </Grid>
            </Grid>
        </Container>

    );
}

export default Browse