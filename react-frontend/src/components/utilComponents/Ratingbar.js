import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import assumptionScore from './AssumptionScore';



const useStyles = makeStyles((theme) => ({
    colorPrimary: {
      backgroundColor: '#f44336',
    },
    barColorPrimary: {
      backgroundColor: '#4caf50',
    },
    // ratingbar: {
    //   '&:hover': {
    //     "cursor": 'pointer',
    //   }
    // }
    tooltipWidth: {
        maxWidth: 215,
      },
  }));

const Ratingbar = (props) => {
    const classes = useStyles();
    const score = assumptionScore(props.posSources, props.negSources)
    return (
        <Tooltip arrow title={props.tooltip} aria-label="add"  classes={{ tooltip: classes.tooltipWidth }}>
            <LinearProgress value={score}  style={{"height":"20px"}} className={classes.ratingbar} classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}} variant="determinate" />
        </Tooltip>
    )
}

export default Ratingbar
