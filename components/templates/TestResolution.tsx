import React from "react"
import {
  List,
  ListItem,
  Dialog,
  DialogTitle,
  ListItemText,
} from "@material-ui/core"

interface ResolutionProps {
  open: boolean
  selectedValue: string
  onClose: (value: string) => void
  testHistoryId: string | number
}

export const TestResolution = function(props: ResolutionProps) {
  const { onClose, selectedValue, open, testHistoryId } = props

  const testResolutions = [
    "Not set",
    "Test is flaky",
    "Product defect",
    "Test needs to be updated",
    "To investigate",
  ]

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
      `${process.env.publicDeltaCore}/api/v1/test_history_resolution`,
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
