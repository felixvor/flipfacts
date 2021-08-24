import './App.css';
import React, { Component } from 'react'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {brightTheme, darkTheme} from "./styles/Themes"

import {Route, BrowserRouter }  from "react-router-dom"


import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Logout from "./components/Logout/Logout"
import Search from "./components/Search/Search"
import Browse from "./components/Browse/Browse"
import Register from "./components/Register/Register"
import Claim from "./components/Claim/Claim"
import CreateNew from "./components/CreateNew/CreateNew"
import Account from "./components/Account/Account"
import Recover from "./components/Recover/Recover"
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import About from './components/About/About';


import axios from 'axios';

export class App extends Component {

  constructor(props) {
    super(props)

    let userPrefersDark;
    if( localStorage.getItem('useDarkTheme') !== null){
      userPrefersDark = localStorage.getItem('useDarkTheme')==="true"
    }else{
      const hour = new Date().getHours()
      userPrefersDark = (hour >= 21 || hour <= 5)
    }
    this.state = {
      "useDarkTheme": userPrefersDark,
      "loggedIn":false,
    }
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: '/api/profile/role',
      }).then( (response)  => {
          console.log(`Logged in as ${response.data}`)
          if(response.data !== "guest"){
            this.setState({"loggedIn":true})
          }
      })
      .catch((error) => {
        console.log(error.response)
      });
  }



  // HANDLERS:
  themeChangeHandler = () => {
    const switchTheme = this.state["useDarkTheme"]?"false":"true"
    localStorage.setItem('useDarkTheme', switchTheme)
    console.log(`Saved to local storage: 'useDarkTheme:'${switchTheme}'`)
    this.setState((prevState) => ({
      "useDarkTheme" : !prevState["useDarkTheme"]
    }));
  }

  loginSuccess = (redirect) => {
    this.setState({"loggedIn":true})
    if(redirect){
      const redirectPath = atob(redirect); //B64 to string
      window.location.href = redirectPath //reload at new location
    }
  }

  logoutSuccess = () => {
    this.setState({"loggedIn":false})
  }

  render() {
    console.log("RERENDER APP")
    // axios.get("/test").then(res => {
    //   console.log(res)
    // })

    const theme = createMuiTheme({
      palette: this.state.useDarkTheme ? darkTheme : brightTheme,
    });


    const PleaseLogin = () => <h2>Please Login to view this page</h2>
    const AlreadyLoggedIn = () => <h2>You are already logged in.</h2>



    return (

        <div className="App">
          <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
              
              <Header themeChangeHandler={this.themeChangeHandler} loggedIn={this.state.loggedIn}/>

              {/* space for appearing header on top of page: */}
              <div style={{"paddingTop":50}}></div>
              
              <Route path="/" exact render={(routeProps) => <Home {...routeProps} loggedIn={this.state.loggedIn}/>}>
              </Route>

              <Route path="/new" exact>
                {this.state.loggedIn && <CreateNew/>} 
              </Route>
              
              <Route path="/browse" exact> 
                <Browse useDarkTheme={this.state.useDarkTheme}/>
              </Route>

              <Route path="/search/:b64query?" render={(routeProps) => 
                  <Search {...routeProps} loggedIn={this.state.loggedIn}/>}>
              </Route>
              
              <Route path="/claims/:id" render={(routeProps) => 
                  <Claim {...routeProps} loggedIn={this.state.loggedIn}/>}>
              </Route>
              
              <Route path="/login" exact>
                {!this.state.loggedIn && <Login loginSuccess={this.loginSuccess}/>}
                {this.state.loggedIn && <AlreadyLoggedIn/>}
              </Route>
              
              <Route path="/logout" exact> 
                <Logout logoutSuccess={this.logoutSuccess}/>
              </Route>
              
              <Route path="/register" exact>
                {!this.state.loggedIn && <Register/>}
                {this.state.loggedIn && <AlreadyLoggedIn/>}
              </Route>

              <Route path="/account" exact>
                {this.state.loggedIn && <Account/>}
                {!this.state.loggedIn && <PleaseLogin/>}
              </Route>
              
              <Route path="/recover" exact>
                <Recover/>
              </Route>
              
              <Route path="/about" exact>
                <About/>
              </Route>

              <Footer/>
          </ThemeProvider>
          </BrowserRouter>
        </div>
      // </BrowserRouter>
    );
  }
}

export default App