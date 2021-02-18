import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Typography } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    container: {
      paddingTop: theme.spacing(12),
      paddingBottom: theme.spacing(16),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      textAlign: "justify",
      overflowX: "hidden"
    },
    headline: {
        paddingTop: theme.spacing(12)
    },
    blocktext: {
        fontSize: 17,
        textOverflow: "ellipsis",
    },
  }));

  

const About = (props) => {
    const classes = useStyles()

    const { pathname, hash } = useLocation()

    useEffect(() => {
        // if not a hash link scroll to top
        if(hash===''){
            window.scrollTo(0, 0)
        }
        // else scroll to id
        else{
            setTimeout(
                () => {
                    const id = hash.replace('#', '');
                    const element = document.getElementById(id);
                    if (element) {
                        element.scrollIntoView();
                    }
                },
                0
            );
        }
    }, [pathname]) // do this on route change
        
    return (
        <div>    
            <Container maxWidth="md" > 
                <Grid container className={classes.container}>

                    <Grid item xs={12}>
                        <Typography variant="h2" id={"about"}>About</Typography>
                        <Typography className={classes.blocktext}>
                            FlipFacts is a website where you can post and rate short statements. However, rating does not just happen based on gut feeling: for each positive or negative rating you must provide a scholarly source that supports or contradicts the statement you want to rate.
                        </Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            The original intention was to create a tool that could be used to quickly look up reputable sources for important, everyday statements. However, it quickly became clear that most things are much much much more complicated than one would assume at first glance, so it made sense to think about how users could empirically disagree with statements. Creating a site where all kinds of thoughts are subjected to a public, but still scientific evaluation allows users to contribute their thoughts and ideas even without scientific background knowledge. And to recognize later, that an idea you had is actually wrong, is at least as valuable as finding confirmation - at least that's the attitude FlipFacts wants to pursue. 
                        </Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            If things are too multidimensional to be presented in a single statement, diving into the given sources and displaying thematically relevant assumptions allows a deeper insight into the topic. A semantic search allows to find statements without knowing the exact wording of the post you may be looking for. If sources do not match the statements or the statement itself is vague and misleading, they can be marked for review by a moderator. Let's see if this works...
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <br/>
                        <Typography variant="h5" id={"score"}>• How is the rating of an assumption determined?</Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            The green and red bars indicate the validity of an assumption based on the provided sources. However, there are usually many sources on a topic that illuminate different perspectives. The number of sources alone may therefore say little about the quality of a statement. To compensate for this, the validity score is based on all provided sources and their respective citation count. The citation count describes how often the source has been referenced in other publications and should give an indication of the scientific relevance of each source. 
                        </Typography>
                        <br/>
                    </Grid>

                    <Grid item xs={12}>
                        <br/>
                        <Typography variant="h5" id={"source"}>• How do you make sure sources are valid?</Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            Users must provide a unique identification code of a scientific publication when adding a source. You can see which identification codes are supported when you attempt add a source. This code is closely scrutinized by the server before the source is added to the statement. 
                        </Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                             One of many good places to start looking for sources is <Link target="_blank" href="https://www.semanticscholar.org/">SemanticScholar</Link>. Also there is a <Link target="_blank" href="https://en.wikipedia.org/wiki/List_of_academic_databases_and_search_engines">List of academic databases and search engines</Link> on Wikipedia.
                        </Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            However, it is possible that sources have been misinterpreted by users or otherwise do not match the statement above. In this case, users are encouraged to report the source for further evaluation. 
                        </Typography>
                        <br/>
                    </Grid>

                    <Grid item xs={12}>
                        <br/>
                        <Typography variant="h5" id={"source"}>• What's next?</Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            I still have ideas to improve this website. Some of them are:
                            <ul>
                                <li>
                                    More browsing options like <i>recently added</i>, <i>most viewed recently</i>, <i>waiting for sources</i>, and more.
                                </li>
                                <li>
                                    A profile page that shows your posts and recent activity.
                                </li>
                                <li>
                                    Improve assumption ratings based on the source's citations in recent years, whether the number of citations is increasing or decreasing, release year, influence and intent in other publications, and more.
                                </li>
                                <li>
                                    Some technical stuff like caching relevant posts or search results to make the website faster.
                                </li>
                            </ul>
                        </Typography>
                        <br/>
                    </Grid>
                    


                    <Grid item xs={12}>
                        <Typography variant="h2" id={"datausage"} className={classes.headline}>Data Usage</Typography>
                        <Typography className={classes.blocktext}>
                            FlipFacts represents the values of freedom from censorship, anonymity and public access to information on the Internet. We therefore try to store as little personal data as possible. 
                        </Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            To enable the creation and use of user accounts, we store username and email address and the date of registration. I keep saying <i>we</i> but I am actually just one guy... Anyways, passwords are never stored or displayed in plain text. A hashing process is used to check passwords on login.
                        </Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            When assumptions are created or sources are added, the executing user, the current date and the content of the new assumption or source are persisted.
                        </Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            Sources and assumptions can be reported by users together with a suggestion for improvement. The original intention of a contribution is always kept untouched. However, vague formulations or the lack of clear, measurable variables can be subject to optimization. Obvious spam will be deleted. When a report is made, the current date, the reported assumption or source and the suggestion for improvement are persisted. To prevent misuse of the reporting function, the acting user is also stored.
                        </Typography>
                        <br/>
                        <Typography className={classes.blocktext}>
                            To evaluate the user experience of the site, recent queries and search terms can be displayed to the administrator. However, they are never associated with specific user accounts or stored long-term and are deleted periodically.
                        </Typography>
                        <br/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" id={"contact"} className={classes.headline}>Contact</Typography>
                        <Typography className={classes.blocktext}>If you have questions, suggestions, or you feel like insulting me:</Typography>
                        <ul>
                            <li>
                                <Typography className={classes.blocktext}>
                                    E-Mail: <Link target="_blank" href="mailto:admin@bratp.fun">admin@bratp.fun</Link>
                                </Typography>
                            </li>
                            <li>
                                <Typography className={classes.blocktext}>
                                    Discord: <Link target="_blank" href="https://discord.com/users/174212127614042112">Kartoffel#3880</Link>
                                </Typography>
                            </li>
                        </ul>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h4" id={"support"} className={classes.headline}>Support</Typography>
                        <Typography  className={classes.blocktext}>This is my first public web project. Development, maintenance, domain and server costs will be paid out of my own pocket as long as I can afford it. If you like the idea and want to keep the project alive, you can support it via the following channels:</Typography>
                        <ul>
                            <li>
                                <Typography className={classes.blocktext}>
                                PayPal: <Link target="_blank" href="https://paypal.me/pools/c/8x0nyMaEtC">paypal.com/pools/c/8x0nyMaEtC</Link>
                                </Typography>
                            </li>
                            <li>
                                <Typography className={classes.blocktext} noWrap>
                                    Nano: <Link target="_blank" href="https://mynano.link/nano_1bw3ecrcohaueutiy5b9w6ky98tp9a173ypsft7fjuhkeo9k6eb9tfg1b95r">nano_1bw3ecrcohaueutiy5b9w6ky98tp9a173ypsft7fjuhkeo9k6eb9tfg1b95r</Link>
                                </Typography>
                            </li>
                        </ul>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default About
