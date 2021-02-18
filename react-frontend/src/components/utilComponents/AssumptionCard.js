import React from 'react'
import Ratingbar from "../utilComponents/Ratingbar"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom"



const useStyles = makeStyles((theme) => ({
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        "cursor": 'pointer',
        "box-shadow": "0px 0px 16px #000000"
      }
    },
    cardContent: {
      flexGrow: 1,
    },

    cardheader:{
      color:'#9e9e9e',
    }
  }));
  

const AssumptionCard = (props) => {
    const classes = useStyles();
    
    return(
      <Grid item key={props.id} xs={12} sm={12} md={12}>
        <Link to={"/claims/"+props.id} style={{ textDecoration: 'none' }}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Grid container justify="center" >
                
                <Grid item xs={12} className={classes.cardheader}>
                  <Typography>
                    <i>{props.views} views • posted {props.datePosted}</i>
                  </Typography>
                </Grid>
                
                <Grid item  xs={11} style={{"paddingTop":"15px"}}>
                  <Typography variant="h5" component="h2">
                    <i>"{props.text}"</i>
                  </Typography>
                </Grid>
              </Grid>
              <br/>
              <Grid item  xs={12}>
                  <Ratingbar posSources={props.positiveSources} negSources={props.negativeSources} tooltip={"the validity score is derived from the number of sources and their citations"}></Ratingbar>
              </Grid>
              <Grid container>
                <Grid item  xs={3} >
                  {props.positiveSources.length} <br/> supporting sources
                </Grid>
                <Grid item  xs={6} >
                </Grid>
                <Grid item  xs={3} >
                   {props.negativeSources.length} <br/> contradictory sources
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    )
  }

export default AssumptionCard