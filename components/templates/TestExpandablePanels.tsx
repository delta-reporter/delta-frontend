import React from "react"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel"
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import {
  Typography,
  List,
  withStyles,
  ListItem,
  Card,
  CardActionArea,
  CardMedia,
} from "@material-ui/core"
import ReactPlayer from "react-player"

const ExpandablePanel = withStyles({
  root: {
    width: "100%",
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

const CollapsedLineSummary = withStyles({
  root: {
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

const PanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    width: "100%",
  },
}))(MuiExpansionPanelDetails)

interface TestProps {
  children: any
}

export const TestErrorMessageExpansionPanel = function(props: TestProps) {
  const { children } = props

  const [expandedErrorPanel, setExpandedErrorPanel] = React.useState<
    string | false
  >(false)
  const expandCollapsePanel = (errorPanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedErrorPanel(isExpanded ? errorPanel : false)
  }

  return (
    <div style={{ paddingTop: "10px" }}>
      <ExpandablePanel
        key={children.test_history_id}
        expanded={expandedErrorPanel === children.message}
        onChange={expandCollapsePanel(children.message)}
        TransitionProps={{ unmountOnExit: true }}
        style={{
          backgroundColor: "#f9e6e6", // error message expandable color
          borderBottom: "1px solid #f9e6e6",
        }}
      >
        <CollapsedLineSummary
          expandIcon={<ExpandMoreIcon />}
          style={{
            backgroundColor: "#f9e6e6", // error message collapsed color
            borderBottom: "1px solid #f9e6e6",
          }}
        >
          <Typography
            color="textPrimary"
            style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }} // this is if the message is to long to make it fit the container
          >
            {children.message}
          </Typography>
        </CollapsedLineSummary>
        <PanelDetails>
          <List>
            <ListItem
              style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}
            >
              {" "}
              {children.trace}
            </ListItem>
          </List>
        </PanelDetails>
      </ExpandablePanel>
    </div>
  )
}

export const TestMediaExpansionPanel = function(props: TestProps) {
  const { children } = props

  const [mediaExpandedPanel, setMediaExpandedPanel] = React.useState<
    string | false
  >(false)
  const expandCollapsePanel = (mediaPanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setMediaExpandedPanel(isExpanded ? mediaPanel : false)
  }

  return (
    <div style={{ paddingTop: "10px" }}>
      {children.media.map(media => (
        <div style={{ paddingTop: "10px" }} key={media.file_id}>
          <Card>
            <ExpandablePanel
              key={media.file_id}
              expanded={mediaExpandedPanel === media.file_id}
              onChange={expandCollapsePanel(media.file_id)}
              TransitionProps={{ unmountOnExit: true }}
              style={{
                backgroundColor: "#F3EFEE", // media block  expandable color
                borderBottom: "1px solid #F3EFEE",
              }}
            >
              <CollapsedLineSummary
                expandIcon={<ExpandMoreIcon />}
                style={{
                  backgroundColor: "#F3EFEE", // media block collapsed color
                  borderBottom: "1px solid #F3EFEE",
                }}
              >
                {media.type === "img" ? (
                  <Typography color="textPrimary">Screenshot</Typography>
                ) : (
                  <Typography color="textPrimary">Video</Typography>
                )}
              </CollapsedLineSummary>
              <PanelDetails>
                <CardActionArea>
                  {media.type === "img" ? (
                    <CardMedia
                      component="img"
                      alt={media.filename}
                      style={{ height: 360, maxWidth: 640 }}
                      src={
                        `${process.env.publicDeltaCore}/api/v1/get_file/` +
                        media.file_id
                      }
                      title={media.filename}
                    />
                  ) : (
                    <ReactPlayer
                      url={`${process.env.publicDeltaCore}/api/v1/get_file/${media.file_id}`}
                      autosize
                      controls={true}
                      key="file"
                      height="360"
                      width="640"
                    />
                  )}
                </CardActionArea>
              </PanelDetails>
            </ExpandablePanel>
          </Card>
        </div>
      ))}
    </div>
  )
}
