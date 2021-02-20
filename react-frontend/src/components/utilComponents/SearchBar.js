import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import { Button, Grid, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';




const random_boolean = Math.random() < 0.5;

const SearchBar = (props) => {

  const history = useHistory()

  const [wideScreen, setWideScreen] = useState(window.innerWidth > 512 ? true : false)
  const handleResize = () => {
    console.log(window.innerWidth)
    setWideScreen(window.innerWidth > 512 ? true : false)
  }
  useEffect(() => {
    window.addEventListener("resize", () => handleResize());
  }, [])

  const searchHandler = (e) =>{
      e.preventDefault()
      const formData = new FormData(e.target);
      var object = {};
      formData.forEach((value, key) => object[key] = value);
      const b64search = btoa(object["search"])
      history.push('/search/'+b64search)
  } 
  
  const ws_placeholder = `Search a statement you'd like to ${random_boolean?"debunk":"confirm"}...`
  const ss_placeholder = `Search a claim to ${random_boolean?"debunk":"confirm"}...`

  return(
          <form onSubmit={(e)=>searchHandler(e)}>
              <Grid container>
                <Grid item sm={10} xs={12}>
                  <TextField fullWidth 
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="search" 
                    type="search" 
                    name="search" 
                    placeholder={wideScreen?ws_placeholder:ss_placeholder} 
                    // label={"Semantic Search"}
                    variant="outlined" 
                    defaultValue={props.initialValue}/>
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