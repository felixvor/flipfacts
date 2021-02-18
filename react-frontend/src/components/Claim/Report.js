import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Link, makeStyles, TextField, Typography } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";
import React, { useState } from "react"



const Report = (props) =>{
    let title = ""
    let text = ""
    if (props.source){
      title="Report Source"
      text="Please explain why you think this source is not relevant for this assumption. Try to go into detail about how a moderator could verify your report."
    }
    if (props.assumption){
      title="Report Assumption"
      text="Please explain why you think this assumption is misleading or unclear. If possible, try to provide an example of an improved and measurable version for the original intention of the statement."
    }

    const [reportWasSent, setReportWasSent] = useState(false)
    const [reportResponse, setReportResponse] = useState("Error")

    const sendReport = (e) => {
      e.preventDefault()
      const formData = new FormData(e.target);
      var object = {};
      formData.forEach((value, key) => object[key] = value);
      object["assumption"] = props.assumption?props.assumption.id:null
      object["source"] = props.source?props.source.id:null
      
      axios({
        method: 'post',
        url: '/api/report',
        data: JSON.stringify(object),
        headers: {'Content-Type': 'application/json' }
        }).then( (response)  => {
            console.log(response)
            setReportWasSent(true)
            setReportResponse("Thank you for your report! A Moderator will look into it.")
        })
        .catch((error) => {
          setReportWasSent(true)
          if(error.response.status == 500){
            setReportResponse(`Something went wrong. Report was not received. Please contact the administrator.`)
          }else{
            setReportResponse(`Something went wrong. Error Code ${error.response.status}: ${error.response.data}`)
          }
          //alert("Something went wrong")
        });


    }

    return (
      <div>
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
        {reportWasSent &&
          <div>
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
              <h2>{reportResponse}</h2>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.handleClose}>
                Close
              </Button>
            </DialogActions>
          </div>
        }
        {!reportWasSent && 
          <form onSubmit={(e)=>sendReport(e)} >
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {text}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                multiline
                rows={1}
                rowsMax={6}
                id="comment"
                name="comment"
                label="Comment"
                type="text"
                helperText="Feel free to ignore this when reporting obvious spam"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={props.handleClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Send Report
              </Button>
            </DialogActions>
          </form>
        }
      </Dialog>
    </div>
    )
}

export default Report