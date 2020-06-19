import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  Typography,
  List,
  ListItem,
  withStyles,
  Box,
  AppBar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  ListItemText,
  Button,
  CardMedia,
  CardActionArea,
  Card,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel"
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 3500,
  },
  title: {
    fontSize: "2em",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  bigMargin: {
    marginTop: theme.spacing(1),
    marginButtom: theme.spacing(3),
  },
  marginBottom: {
    marginButtom: theme.spacing(3),
  },
  paperNoPadding: {
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  tabs: {
    marginTop: theme.spacing(1),
    width: "100%",
  },
  backgroundColor: {
    maxWidth: "50",
  },
}))

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: any
  value: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

interface TestProps {
  children: any
}

export const TestExpanded = function(props: TestProps) {
  const { children } = props
  const classes = useStyles(props)

  const [expandedErrorMessage, setExpandedErrorMessage] = React.useState<
    string | false
  >(false)
  const expandCollapseErrorMessage = (errorMessagePanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedErrorMessage(isExpanded ? errorMessagePanel : false)
  }

  const ErrorMessagePanel = withStyles({
    root: {
      width: "100%",
      backgroundColor: "#f9dbdb", // error message expanded color
      borderBottom: "1px solid #ffa7a7",
      boxShadow: "none",
      "&:not(:last-child)": {
        borderBottom: 0,
      },
      "&:before": {
        display: "none",
      },
      "&$expanded": {
        margin: "auto",
      },
    },
    expanded: {},
  })(MuiExpansionPanel)

  const ErrorMessageCollapsedLineSummary = withStyles({
    root: {
      backgroundColor: "#f9e6e6", // error message color
      borderBottom: "1px solid #f9e6e6",
      marginBottom: -1,
      minHeight: 56,
      "&$expanded": {
        minHeight: 56,
      },
      width: "100%",
    },
    content: {
      "&$expanded": {
        margin: "12px 0",
      },
    },
    expanded: {},
  })(MuiExpansionPanelSummary)

  const ErrorMessagePanelDetails = withStyles(theme => ({
    root: {
      padding: theme.spacing(2),
      width: "100%",
    },
  }))(MuiExpansionPanelDetails)

  interface ResolutionProps {
    open: boolean
    selectedValue: string
    onClose: (value: string) => void
    testHistoryId: string | number
  }

  const testResolutions = [
    "Not set",
    "Test is flaky",
    "Product defect",
    "Test needs to be updated",
    "To investigate",
  ]

  const [openResolutionDialog, setOpenResolutionDialog] = React.useState(false)
  const [resolutionResponse, setResolutionResponse] = React.useState(
    testResolutions[0]
  )

  const handleResolutionDialogOpen = () => {
    setOpenResolutionDialog(true)
  }

  const handleResolutionDialogClose = (value: string) => {
    setOpenResolutionDialog(false)
    setResolutionResponse(value)
  }

  function SetTestResolution(props: ResolutionProps) {
    const { onClose, selectedValue, open, testHistoryId } = props

    const handleClose = () => {
      onClose(selectedValue)
    }

    const handleListItemClick = async (resolution: string) => {
      // PUT request using fetch with async/await
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_history_id: testHistoryId,
          test_resolution: resolution,
        }),
      }
      console.log(requestOptions)

      const response = await fetch(
        `${process.env.deltaCore}/api/v1/test_history_resolution`,
        requestOptions
      )
      const data = await response.json()
      onClose(data.message)
    }

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">Set resolution:</DialogTitle>
        <List>
          {testResolutions.map(resolution => (
            <ListItem
              button
              onClick={() => handleListItemClick(resolution)}
              key={resolution}
            >
              <ListItemText primary={resolution} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    )
  }

  const [historyTabValue, setHistoryTabValue] = React.useState(0)
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setHistoryTabValue(newValue)
  }

  const [expandedMedia, setExpandedMedia] = React.useState<
  string | false
>(false)
const expandCollapseMedia = (mediaPanel: string) => (
  _event: React.ChangeEvent<{}>,
  isExpanded: boolean
) => {
  setExpandedMedia(isExpanded ? mediaPanel : false)
}

const MediaPanel = withStyles({
  root: {
    width: "100%",
    backgroundColor: "#F3EFEE", // screenshot expandable panel color
    borderBottom: "1px solid #F3EFEE",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiExpansionPanel)

const MediaPanelCollapsedSummary = withStyles({
  root: {
    width: "100%",
    backgroundColor: "#F3EFEE", // screenshot collapsed panel color
    borderBottom: "1px solid #F3EFEE",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary)

const MediaPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    width: "100%",
  },
}))(MuiExpansionPanelDetails)

  return (
    <div
      key={children.test_history_id}
      className={classes.root}
      style={{ paddingLeft: "50px" }}
    >
      {children.name ? ( // when page is just loaded and no test selected - half page to be blank
            <Paper className={classes.paperNoPadding} elevation={0}>
              <AppBar
                style={{ backgroundColor: "white", border: "none",  paddingTop: "45px" }}
                variant="outlined"
                position="relative"
                className={classes.tabs}
              >
                <Tabs
                  value={historyTabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="secondary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="Info" id="tab-0" />
                  <Tab label="Test History" id="tab-1" />
                </Tabs>
              </AppBar>
              <TabPanel value={historyTabValue} index={0}>
              <Typography style= {{padding: "10px"}}>
            Full path:
            <span style={{ color: "grey" }}> {children.file}</span>
          </Typography>
              <Typography style= {{padding: "10px"}}>
           Duration:
           <span style={{ color: "grey" }}> {children.duration.minutes} min {children.duration.seconds} sec </span>
         </Typography>
         <Typography style= {{padding: "10px"}}>
           Error type:
           <span style={{ color: "grey" }}> {children.error_type} </span>
         </Typography>
              {children.message ? ( // if there is any error message - show the info, else - test passed
              <div style= {{paddingTop: "10px"}}>
                <ErrorMessagePanel
                  key={children.test_history_id}
                  expanded={expandedErrorMessage === children.message}
                  onChange={expandCollapseErrorMessage(children.message)}
                  TransitionProps={{ unmountOnExit: true }}
                >
                  <ErrorMessageCollapsedLineSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography
                      color="textPrimary"
                      style={{ wordBreak: "break-all" }} // this is if the message is to long to make it fit the container
                    >
                      {children.message}
                    </Typography>
                  </ErrorMessageCollapsedLineSummary>
                  <ErrorMessagePanelDetails>
                    <List>
                      <ListItem
                        style={{ wordBreak: "break-all" }} // this is if the message is to long to make it fit the container
                        button
                      >
                        {" "}
                        {children.trace}
                      </ListItem>
                    </List>
                  </ErrorMessagePanelDetails>
                </ErrorMessagePanel>
                <div style= {{padding: "10px"}}>
                  <Typography className={classes.bigMargin}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleResolutionDialogOpen}
                      className={classes.bigMargin}
                    >
                      Set test resolution
                    </Button>{" "}
                    <span style={{ color: "grey", fontStyle: "italic", padding: "10px"}}>
                      {resolutionResponse}
                    </span>
                  </Typography>
                  <SetTestResolution
                    open={openResolutionDialog}
                    selectedValue={resolutionResponse}
                    onClose={handleResolutionDialogClose}
                    testHistoryId={children.test_history_id}
                  />
                </div>
                </div>
                 ) : (
                  <div></div>
                )}
                {children.media ? ( // check if there is any media for this test
                <div                   style= {{padding: "10px"}}
                >
              <Card className={classes.root} >
                {children.media.map(media => (
                  <MediaPanel
                  key={media.file_id}
                  expanded={expandedMedia ===  media.file_id}
                  onChange={expandCollapseMedia( media.file_id)}
                  TransitionProps={{ unmountOnExit: true }}
                  >
                  <MediaPanelCollapsedSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    {media.type === "img" ? (
                    <Typography
                      color="textPrimary"
                    >
                      Screenshot
                    </Typography>
                    ) : (
                      <Typography
                      color="textPrimary"
                    >
                      Video
                    </Typography>
                    )}
                  </MediaPanelCollapsedSummary>
                  <MediaPanelDetails>
                  <CardActionArea>
                    <CardMedia
                      component={media.type}
                      alt={media.filename}
                      style={{ height: 360,
                        maxWidth: 640,
                      }}
                      src={
                        `${process.env.deltaCore}/api/v1/get_file/` +
                        media.file_id
                      }
                      title={media.filename}
                    />
                  </CardActionArea>
                  </MediaPanelDetails>
                  </MediaPanel>
                ))}
              </Card>
              </div>
                ) : (
                  <Typography style= {{padding: "10px"}}> 
                  There is no media recorded for this test</Typography>
                )}
              </TabPanel>             
              <TabPanel value={historyTabValue} index={1}>
                <Typography style= {{padding: "10px"}}> COMING: 
              <span style={{ color: "grey", fontStyle: "italic", padding: "10px"}}>
              Historical info for this test 
                    </span>{children.test_id}</Typography>
              </TabPanel>
            </Paper>
      ) : (
          <Typography
                    style={{ fontWeight: 300, margin: "50px", textAlign: "center", fontSize:"20px", fontStyle: "italic", color: "#605959" }}
                  >Please select a test to view</Typography>
      )}
    </div>
  )
}
