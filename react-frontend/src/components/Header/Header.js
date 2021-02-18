import React, {useState, useEffect} from 'react'

import { Link, useHistory } from "react-router-dom"

//import MenuBookIcon from '@material-ui/icons/MenuBook';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Slide, useScrollTrigger } from '@material-ui/core';

import logoSVG from '../../logo.svg'


const useStyles = makeStyles((theme) => ({
    icon: {
        color: "#fff",
    },
    sideDrawerButton: {
        color: "contrast",
        fontSize: 18,
        minWidth: 210,
        lineHeight: "300%",
        paddingLeft: "45px",
        paddingRight: "45px"
    },
    menuButton: {
        color: "#fff",
        fontSize: 18,
        minWidth: 210,
        lineHeight: "300%",
        paddingLeft: "45px",
        paddingRight: "45px"
    },
    hoverPointer:{
        '&:hover': {
            "cursor": 'pointer',
          }
    }
}));


const Desktop = (props) => {

    const classes = useStyles();
    const history = useHistory(); 

    let buttonsLeft = props.bLeft.map(buttonInfo => {
        return <Button key={buttonInfo.label} size="large" component={Link} to={buttonInfo.href} className={classes.menuButton}  color="default"> {buttonInfo.label} </Button>
    })

    let buttonsRight = props.bRight.map(buttonInfo => {
        return <Button key={buttonInfo.label} size="large" component={Link} to={buttonInfo.href} className={classes.menuButton}> {buttonInfo.label} </Button>
    })

    return (
        <div style={{"width":"100%"}}>
            <Box display="flex">
                <Box  display="flex" justifyContent="flex-start">
                    <Button key={"home"} component={Link} to={'/'}>  <HomeIcon className={classes.icon} /> </Button>
                    {buttonsLeft}
                </Box>
                <Box flexGrow={1} justifyContent="center" style={{ "marginTop":"10px", "height":"3em"}}>  
                    {/* <MenuBookIcon  className={classes.icon} fontSize="large" />     */}
                    <img className={classes.hoverPointer} onClick={()=> {history.push("/")}} height={48} src={logoSVG} alt="FlipFacts"/>                                 
                </Box>
                <Box  display="flex" justifyContent="flex-end">
                    {buttonsRight}
                    <Button key={"theme"} onClick={props.themeChangeHandler}><Brightness4Icon className={classes.icon}  /></Button>
                </Box>
            </Box>
        </div>
    )
}

const Mobile = (props) => {

    const [openDrawer, setOpenDrawer] = useState(false)
    const history = useHistory(); 

    const classes = useStyles();

    const toggleDrawer = (_ , open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setOpenDrawer(open)
      };

      const anchor = "left"

    let listItems = props.buttons.map((bInfo) => {
        return (
            <ListItem className={classes.sideDrawerButton} component={Link} to={bInfo.href} button key={bInfo.label} onClick={toggleDrawer(anchor, false)}>
                <ListItemText primary={bInfo.label} />
          </ListItem>
        )
    })

    return(
        <div style={{"width":"100%"}}>
            <Box display="flex">
                <Box display="flex" justifyContent="flex-start">
                    <React.Fragment key={anchor}>
                        <Button onClick={toggleDrawer(anchor, true)}><MenuIcon className={classes.icon}/></Button>
                            <Drawer anchor={anchor} open={openDrawer} onClose={toggleDrawer(anchor, false)}>
                            <Divider style={{"marginTop":"20px"}} />
                            <ListItem className={classes.sideDrawerButton} component={Link} to={"/"} button key={"FlipFacts"} onClick={toggleDrawer(anchor, false)}>
                                    <ListItemText primary={"FlipFacts"} />
                            </ListItem>
                            <Divider style={{"marginBottom":"20px"}} />
                            {listItems}
                        </Drawer>
                    </React.Fragment>
                </Box>
                <Box flexGrow={1} component={Link} to={"/"} justifyContent="center" style={{"marginTop":"3px", "height":"3em"}}>  
                    {/* <MenuBookIcon className={classes.icon} fontSize="large" /> */}
                    <img className={classes.hoverPointer} onClick={()=> {history.push("/")}} height={40} src={logoSVG} alt="FlipFacts"/>                                 
                                
                </Box>
                <Box className={classes.buttonBoxLRight}  display="flex" justifyContent="flex-end">
                    <Button onClick={props.themeChangeHandler}><Brightness4Icon className={classes.icon}/></Button>
                </Box>
            </Box>
        </div>
  )
}





const Header = (props) => {

   const [wideScreen, setWideScreen] = useState(window.innerWidth > 1024 ? true : false)

    const handleResize = () => {
        setWideScreen(window.innerWidth > 1050 ? true : false)
    }

    useEffect(() => {
        window.addEventListener("resize", () => handleResize());
    }, [])

    const headerButtonsLeft = [
        {
            label: "Search",
            href: "/search",
        },
        {
            label: "Top Posts",
            href: "/browse",
        }
    ];

    let headerButtonsRight = []

    if (props.loggedIn) { // if logged in
        headerButtonsRight = [
            {
                label: "My Account",
                href: "/account",
            },
            {
                label: "Log Out",
                href: "/logout",
            },
        ] 
    } else {
        headerButtonsRight = [
            {
                label: "Login",
                href: "/login",
            },
            {
                label: "Register",
                href: "/register",
            }
        ]
    }

    return (
        <div>
            <HideOnScroll {...props}>
            <AppBar>
                <Toolbar>
                    {wideScreen ? 
                    <Desktop bLeft={headerButtonsLeft} bRight={headerButtonsRight} themeChangeHandler={props.themeChangeHandler}/> 
                        : 
                    <Mobile buttons={headerButtonsLeft.concat(headerButtonsRight)} themeChangeHandler={props.themeChangeHandler}/>}
                    
                </Toolbar>
            </AppBar>
            </HideOnScroll>
        </div>
    )
}


function HideOnScroll(props) {
    const { children  } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger();
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }
  

export default Header

