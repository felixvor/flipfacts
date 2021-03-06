import React from 'react'
import Ratingbar from "../utilComponents/Ratingbar"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom"
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import assumptionScore from './AssumptionScore';
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
    
    console.log(props)
    const score = assumptionScore(props.positiveSources, props.negativeSources)

    return(
      <Grid item key={props.id} xs={12} sm={12} md={12}>
        <Link to={"/claims/"+props.id} style={{ textDecoration: 'none' }}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Grid container justify="center">
                <Grid item xs={12} className={classes.cardheader}>
                  <Typography>
                    {false && props.views && <i> {props.views} views • </i>}
                    {props.datePosted && <i> posted {props.datePosted}</i>}
                    {props.author && <i> • by {props.author}</i>}
                  </Typography>
                </Grid>
                
                <Grid item  xs={12} style={{"paddingTop":"15px"}}>
                  <Typography variant="h5" component="h2">
                    <i>"{props.text}"</i>
                  </Typography>
                </Grid>
                <Grid item md={11} xs={12}>
                  <Grid item xs={12} style={{"marginRight":"-8px", "paddingTop":"12px"}}>
                      <Ratingbar height={16} posSources={props.positiveSources} negSources={props.negativeSources} tooltip={"the validity score is derived from the number of sources and their citations"}></Ratingbar>
                  </Grid>
                  <Grid item container justify="space-between" style={{"paddingTop":'2px'}}>

                    <Grid item>
                      <Grid container alignItems="center"  style={{"paddingLeft":"12px"}}>
                          <ThumbUpOutlinedIcon style={{"color":'#4caf50', "fontSize":26}}/>
                          <Typography variant="button" style={{"fontSize":16, "color":'#4caf50', "marginLeft":"8px"}}>
                          {`${(score).toFixed(1)}%`}
                          </Typography>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid container alignItems="center"  style={{"paddingRight":"12px"}}>
                        <Typography variant="button" style={{"fontSize":16, "color":'#f44336', "marginRight":"6px"}}>
                          {`${(100-score).toFixed(1)}%`}
                        </Typography>
                        <ThumbDownOutlinedIcon style={{"color":'#f44336', "fontSize":26}}/>
                      </Grid>
                    </Grid>
                 
                  </Grid>

                </Grid>


                
        
              </Grid>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    )
  }

export default AssumptionCard