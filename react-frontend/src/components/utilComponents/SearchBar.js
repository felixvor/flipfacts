import React from 'react';
import {useHistory} from 'react-router-dom';
import { Button, Grid, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';





const SearchBar = (props) => {

    const history = useHistory()

    const searchHandler = (e) =>{
        e.preventDefault()
        const formData = new FormData(e.target);
        var object = {};
        formData.forEach((value, key) => object[key] = value);
        const b64search = btoa(object["search"])
        history.push('/search/'+b64search)
      }


    return(
            <form onSubmit={(e)=>searchHandler(e)}>
                <Grid container>
                  <Grid item sm={10} xs={12}>
                    <TextField fullWidth id="search" type="search" placeholder="semantic search" variant="outlined" name="search" defaultValue={props.initialValue}/>
                  </Grid>
                  <Grid item sm={1} xs={12} style={{"paddingTop":"4px", "paddingLeft":"5px"}}>
                    <Button variant="contained" color="primary" style={{"height":"45px"}} type="submit">
                      <SearchIcon/>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </form>
        )
}

export default SearchBar