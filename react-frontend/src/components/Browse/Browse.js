import React , { useEffect, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { CircularProgress, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';

import AssumptionCard from "../utilComponents/AssumptionCard"
import { Helmet } from 'react-helmet';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
    container: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(4),
        minHeight: "73vh",
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
    const [loading, setLoading] = useState(false)

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
        if(loading){
            return
        }
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
        if(loading){
            return
        }
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
        <Container maxWidth="md" className={classes.container} >
            <Helmet>
                <title>{`FlipFacts - Browse`}</title>
                <meta name="description" content={`Browse the latest and most viewed assumptions of FlipFacts.net - Search and Find scientific sources for everyday assumptions on FlipFacts.net Search everyday thoughts and find relevant sources quick and easy. Create an account and post your own ideas and add new sources!`}/>
            </Helmet>
            <Grid container justify="center">
            <Typography  style={{"paddingBottom":"25px"}} component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>

               Browse Assumptions </Typography>
                <Grid container spacing={2} justify="center">
                    
                        {/* <Breadcrumbs separator="•" aria-label="breadcrumb"> */}
                            <Grid item xs={12} sm={8} lg={9}>
                                <Grid container justify="center">
                                    <Grid item sm={6} md={6} lg={3} xs={12}>
                                        <Chip className={orderBy==="views"?selected:notSelected}  
                                        label="Most Viewed" onClick={()=>handleNewOrder("views")} />
                                    </Grid>  
                                    <Grid item sm={6} md={6} lg={3} xs={12}>  
                                        <Chip className={orderBy==="new"?selected:notSelected}  
                                        label="Recently Added" onClick={()=>handleNewOrder("new")} />
                                    </Grid>
                                    <Grid item sm={6} md={6} lg={3} xs={12}>
                                        <Chip className={orderBy==="updated"?selected:notSelected}  
                                        label="Recently Updated" onClick={()=>handleNewOrder("updated")} />
                                    </Grid>
                                    <Grid item sm={6} md={6} lg={3} xs={12}>
                                        <Chip className={orderBy==="sources"?selected:notSelected}  
                                        label="Fewest Sources" onClick={()=>handleNewOrder("sources")} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        {/* </Breadcrumbs> */}


                    <Grid container style={{"paddingTop":"35px"}} direction="column" justify="center">
                        <Grid container spacing={2} justify="center">                    
                            {!loading &&                   
                                assumptions?
                                    assumptions.map((assumption) => (
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <AssumptionCard showDatePosted key={assumption.id} {...assumption}/>
                                    </Grid>))
                                    :<CircularProgress />
                            }
                                
                        </Grid>
                        <Grid container justify="center" style={{"paddingTop":"35px"}}>                    
                            {!loading && 
                                <Pagination count={maxPages} page={page} showLastButton showFirstButton onChange={(e, page) => handleChangePage(e, page)}/>
                            }
                        </Grid>
                    
                    </Grid>
                </Grid>

            </Grid>
        </Container>

    );
}

export default Browse