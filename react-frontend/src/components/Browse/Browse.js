import React , { useEffect, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { Breadcrumbs, CircularProgress, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';

import AssumptionCard from "../utilComponents/AssumptionCard"

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
    container: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(4),
    },
    chip:{
        height: theme.spacing(6),
        fontSize: "18px",
        '&:hover, &:focus': {
            backgroundColor: theme.palette.grey[300]
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.grey[300]
        }
    },
    selectedBright: {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.grey[300],
        fontWeight: "bold",
    },
    notSelectedBright: {
        color: theme.palette.grey[700],
        backgroundColor: theme.palette.grey[50],
    },
    selectedDark: {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.grey[300],
        fontWeight: "bold",

    },
    notSelectedDark: {
        backgroundColor: theme.palette.grey[700],
        color: theme.palette.grey[200],
    }
  }));

  

const Browse = (props) => {

    const [page, setPage] = useState(1)
    const [maxPages, setMaxPages] = useState(1)
    const [assumptions, setAssumptions] = useState(null)
    const [orderBy, setOrderBy] = useState("views")
    const [loading, setLoading] = useState(true)

    const loadPage = (page) => {
        setLoading(true)
        axios({
            method: 'get',
            url: '/api/assumption/browse/'+page,
            params: { "orderby": orderBy },
            }).then( (response)  => {
                  console.log(response.data)
                  setMaxPages(response.data["maxPages"])
                  setAssumptions(response.data["assumptions"])
                  setLoading(false)
            })
            .catch((error) => {
              console.log(error.response)
              setLoading(false)
            });
    }
    useEffect(() => {
        setLoading(true)
        axios({
            method: 'get',
            url: '/api/assumption/browse/1',
            params: { "orderby": orderBy },
            }).then( (response)  => {
                  console.log(response.data)
                  setMaxPages(response.data["maxPages"])
                  setAssumptions(response.data["assumptions"])
                  setLoading(false)
            })
            .catch((error) => {
              console.log(error.response)
              setLoading(false)
            });
    }, [orderBy])


    const handleNewOrder = (order) =>{
        setPage(1)
        setOrderBy(order)
    }

    const handleChangePage = (e, page) => {
        setPage(page)
        loadPage(page)
    } 

    const classes = useStyles();
    
    //please dont look
    let selected = null
    let notSelected = null
    if(props.useDarkTheme){
        selected = classes.chip + " " + classes.selectedDark
        notSelected = classes.chip + " " + classes.notSelectedDark
    }else{
        selected = classes.chip + " " + classes.selectedBright
        notSelected = classes.chip + " " + classes.notSelectedBright
    }
    //thanks

    return (
        <Container maxWidth="md" className={classes.container}>
            <Grid container justify="center">
            <Typography  style={{"paddingBottom":"25px"}} component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>

               Browse Assumptions </Typography>
                <Grid container spacing={4} justify="center">
                    <Grid>
                        <Breadcrumbs separator="•" aria-label="breadcrumb">
                            <Chip className={orderBy==="views"?selected:notSelected}  
                            label="Most Viewed" onClick={()=>handleNewOrder("views")} />
                            
                            <Chip className={orderBy==="new"?selected:notSelected}  
                            label="Recently Posted" onClick={()=>handleNewOrder("new")} />

                            <Chip className={orderBy==="updated"?selected:notSelected}  
                            label="Recently Updated" onClick={()=>handleNewOrder("updated")} />

                            <Chip className={orderBy==="sources"?selected:notSelected}  
                            label="Fewest Sources" onClick={()=>handleNewOrder("sources")} />
                        </Breadcrumbs>
                    </Grid>


                    <Grid container spacing={4} style={{"paddingTop":"35px"}} justify="center">
                        {!loading && assumptions?(assumptions.map((assumption) => <AssumptionCard key={assumption.id} {...assumption}/>)):(<><CircularProgress /></>)}
                        <Grid item style={{"paddingTop":"20px"}}>                    
                            {!loading && <Pagination count={maxPages} page={page} showLastButton showFirstButton onChange={(e, page) => handleChangePage(e, page)}/> }
                        </Grid>
                    
                    </Grid>
                </Grid>

            </Grid>
        </Container>

    );
}

export default Browse