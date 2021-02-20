import React from 'react';
import { Container, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const Recover = (props) => {

    return (
        <Container maxWidth="lg">
            <Grid item style={{"paddingTop":"200px", "paddingBottom":"175px"}}>
            <Typography>Sorry for the inconvenience.</Typography>
            <br/>
            <Typography>Please send a short mail with "forgot password" to admin@flipfacts.net and to reset your account password</Typography>                
            </Grid>
        </Container>
    );
}

export default Recover