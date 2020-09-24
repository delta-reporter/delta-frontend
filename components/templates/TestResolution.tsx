import React, { useState } from "react"
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core"
import { getResolutionName } from "./showResolution";

interface TestProps {
  testHistoryId: any
  testId: any
  resolution: any
}

export const TestResolution = function(props: TestProps) {
    const { testHistoryId, testId, resolution } = props
    const [resolutionName, setResolutionName] = useState(resolution)
  
    const handleDropdownSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setResolutionName(event.target.value as string);
    console.log(getResolutionName(event.target.value))
    changeResolution(getResolutionName(event.target.value))
      // if (typeof window !== 'undefined') {
      // window.location.reload(false) //temporarily refreshing the page when resolution is updated, need to come up with a better solution
      // }
    };

  const changeResolution = async (resolutionValue) => {
    // PUT request using fetch with async/await
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        test_history_id: testHistoryId,
        test_resolution: resolutionValue,
        test_id: testId
      }),
    }
    console.log(requestOptions)

    const response = await fetch(
      `${process.env.publicDeltaCore}/api/v1/test_history_resolution`,
      requestOptions
    )
    await response.json()
  }

  return (
    <div>
      <Typography >
      Set or update the resolution for this test: 
      </Typography>
      <Typography style={{fontStyle:"italic", fontSize:"12px"}}>
      (This will put a badge on the current and following tests, so next time you see this test, you will know that reason why it's failing is already identified)
      </Typography>
      <FormControl variant="outlined" style={{minWidth: 250, marginTop: "30px"}}>
        <InputLabel>Resolution</InputLabel>
        <Select
          value={resolutionName}
          onChange={handleDropdownSelect}
          label="Resolution"
        >
            <MenuItem value={null}></MenuItem>
            <MenuItem value={1}>Not set</MenuItem>
            <MenuItem value={2}>Test is flaky</MenuItem>
            <MenuItem value={3}>Product defect</MenuItem>
            <MenuItem value={4}>Test needs to be updated</MenuItem>
            <MenuItem value={5}>To investigate</MenuItem>
            <MenuItem value={6}>Environment issue</MenuItem>
        </Select>
      </FormControl> 
    
  </div>
  )
}
