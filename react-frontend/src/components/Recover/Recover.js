import React from 'react';
import { Container, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const Recover = (props) => {

    return (
        <Container maxWidth="sm">
            <Grid item style={{"paddingTop":"200px", "paddingBottom":"175px"}}>
            <Typography variant="h4">Sorry for the inconvenience.</Typography>
            <br/>
            <Typography variant="h6">Please send a short mail with "forgot password" to admin@flipfacts.net to reset your account password</Typography>                
            </Grid>
        </Container>
    );
}

export default Recover