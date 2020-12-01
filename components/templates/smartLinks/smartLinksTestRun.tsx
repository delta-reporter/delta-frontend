import { Button } from "@material-ui/core"
import React from "react"
import getSmartLinksForTestRun from "../../../data/SmartLinksForTestRun"

interface SmartLinksProps {
  project_id: number
  environment: string
  test_run_id: number
}

export const SmartLinksTestRun = function(props: SmartLinksProps) {
  const { project_id, environment, test_run_id } = props

  const { loading, noData, smart_links } = getSmartLinksForTestRun(
    project_id,
    environment,
    test_run_id
  )

  if (noData) {
    return <div></div>
  } else {
    return (
      <div>
        {loading
          ? "Loading smart links..."
          : smart_links.map(smart_link => (
              <Button
                key={smart_link.smart_link_id}
                href={smart_link.smart_link}
                style={{
                  backgroundColor: smart_link.color,
                  width: "auto",
                  height: "auto",
                  marginLeft: "10px",
                  border: "1px #696969 solid",
                  fontSize: "12px",
                  color: "#F5F5DC",
                  float: "right",
                }}
                target="_blank"
              >
                {smart_link.label}
              </Button>
            ))}
      </div>
    )
  }
}
