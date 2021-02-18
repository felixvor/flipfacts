import React from 'react'
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ReportIcon from '@material-ui/icons/Report';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios';

import { useEffect } from "react";

import Ratingbar from "../utilComponents/Ratingbar"
import AssumptionCard from '../utilComponents/AssumptionCard';
import { Divider, IconButton, Tooltip } from '@material-ui/core';
import AddSourceDialog from './AddSourceDialog';
import SourceDialog from './SourceDialog';
import Report from './Report';




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
    },
    reportIcon: {
        fill:'#ef5350'
    },
    cardheader:{
        color:'#9e9e9e',
      }
  }));

  

const Claim = (props) => {
    
    const classes = useStyles();
    const [assumption, setAssumption] = React.useState(null)
    const [similarAssumptions, setSimilarAssumptions] = React.useState(null)
    
    // inspect a source
    const [inspectedSource, setInspectedSource] = React.useState(null);

    // add supportive or contradictary source dialog
    const [openSupp, setOpenSupp] = React.useState(false);
    const [openContra, setOpenContra] = React.useState(false);


    // in case user reports assumption
    const [reportAssumption, setReportAssumption] = React.useState(null)

    // in case user reports source
    const [reportSource, setReportSource] = React.useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        axios({
            method: 'get',
            url: `/api/assumption/${props.match.params.id}`,
            }).then( (response)  => {
                console.log("response")
                console.log(response.data)
                setAssumption(response.data.assumption)
                setSimilarAssumptions(response.data.similarPosts)

            })
            .catch((error) => {
              console.log(error.response)
            });
    }, [props.match.params.id])


    //dialog to add source
    const handleCloseAddSourceDialog = () => {
        setOpenSupp(false);
        setOpenContra(false)
     };

    //dialog for source information
    const handleSourceClicked = (sourceObj) => {
        setInspectedSource(sourceObj)
    }
    const handleCloseSourceDialog = () => {
        setInspectedSource(null);
    };


    //dialog for reporting
    const handleReportAssumptionClicked = (assumptionObj) => {
        setReportAssumption(assumptionObj)
    }
    const handleReportSourceClicked = (sourceObj) => {
        setReportSource(sourceObj)
    }
    const handleCloseReport = () => {
        setReportAssumption(null)
        setReportSource(null)
    };
    

    if(assumption == null){
        return (<h1>Loading...</h1>)
    }
    
    return (
        <div>
            {inspectedSource !== null && <SourceDialog open={inspectedSource !== null} source={inspectedSource} loggedIn={props.loggedIn} report={handleReportSourceClicked} handleClose={handleCloseSourceDialog}/>}
            
            {(reportAssumption !== null || reportSource !== null) && <Report source={reportSource} assumption={reportAssumption} handleClose={handleCloseReport} open={true}></Report>}

            <AddSourceDialog open={openSupp || openContra} supportive={openSupp} loggedIn={props.loggedIn} assumptionId={props.match.params.id} handleClose={handleCloseAddSourceDialog} />
            <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} md={12}>
                    <Card>
                        <CardContent>
                            <Grid container justify="space-between">
                                <Grid item xs={1} className={classes.cardheader}>
                                    <></>
                                </Grid>
                                <Grid item xs={8} className={classes.cardheader} style={{"paddingTop":"15px"}}>
                                    <Typography>
                                        <i>{assumption.views} views • {assumption.datePosted} • by {assumption.author}</i>
                                    </Typography>
                                </Grid>
                                
                                
                                <Grid item xs={1} className={classes.cardheader}>
                                    {props.loggedIn &&
                                    <Tooltip title="Report bad assumption">
                                        <IconButton onClick={ () => handleReportAssumptionClicked(assumption) }>
                                            <ReportIcon className={classes.reportIcon}/>
                                        </IconButton>
                                    </Tooltip>}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} style={{"paddingTop":"40px","paddingBottom":"40px"}}>
                                <Typography variant="h4" component="h2">
                                        "{assumption.text}"
                                </Typography>
                            </Grid>
                            <br/>
                                <Grid item  xs={12}>
                                    <Ratingbar posSources={assumption.positiveSources} negSources={assumption.negativeSources} tooltip={"The validity score is derived from the number of sources and their citations."}></Ratingbar>
                                </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Recent Deposits */}
                <Grid item xs={12} sm={6}>
                    <Typography variant="h5">Supporting Sources <ThumbUpIcon style={{"color":"#4caf50"}}/></Typography>
                    <br/>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow key={0}>
                                    <TableCell>Title</TableCell>
                                    <TableCell align="right">Citations</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {assumption.positiveSources
                            // .slice(positivePage * 5, positivePage * 5 + 5)
                            .map((row) => (
                                    <TableRow hover key={row.title} className={classes.sourceItem} onClick={() => handleSourceClicked(row)}>
                                        <TableCell component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="right">{row.citations}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <TablePagination
                        rowsPerPageOptions={[]}
                        component="div"
                        count={[assumption.positiveSources.length]}
                        rowsPerPage={5}
                        page={positivePage}
                        onChangePage={handlePositivePageChange}
                    /> */}
                    <Grid item>
                        <Button onClick={() => setOpenSupp(true)} variant="outlined" style={{"paddingLeft":"50px", "paddingRight":"50px", "marginTop":"15px"}}>
                            <Typography>add supporting source</Typography>
                        </Button>
                    </Grid>
                </Grid>
                {/* Recent Orders */}
                <Grid item xs={12} sm={6} >
                    
                    <Typography variant="h5"> <ThumbDownIcon style={{"color":'#f44336'}}/> Contradictary Sources</Typography>
                    <br/>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow key={0}>
                                    <TableCell> Title</TableCell>
                                    <TableCell align="right"> Citations</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assumption.negativeSources.map((row) => (
                                    <TableRow hover key={row.name}  className={classes.sourceItem} onClick={() => handleSourceClicked(row)}>
                                        <TableCell component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="right">{row.citations}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid item>
                        <Button onClick={() => setOpenContra(true)}  variant="outlined" style={{"paddingLeft":"50px", "paddingRight":"50px", "marginTop":"15px"}}>
                           <Typography>add contradictary source</Typography>
                        </Button>
                    </Grid>
                </Grid>
                
                <Container className={classes.cardGrid} maxWidth="md">
                    <Divider variant="middle"/>
                    <Typography component="h2" variant="h4" align="center" color="textSecondary" gutterBottom style={{"paddingTop":"55px"}}>
                        Related Assumptions:
                    </Typography>
                    <br/>
                    <br/>
                    <Grid container spacing={4}>
                        {similarAssumptions?(similarAssumptions.map((assumption) => <AssumptionCard key={assumption.id} {...assumption}/>)):(<h2>Loading...</h2>)}
                    </Grid>
                </Container>
            </Grid>
            </Container>
        </div>
    )
}

export default Claim
