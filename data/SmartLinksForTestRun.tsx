import useSWR from "swr"

export default function getSmartLinksForTestRun(
  projectId: number,
  environment: string,
  testRunId: number
): { loading; noData; smartLinks; mutate } {
  const url = `${process.env.publicDeltaCore}/api/v1/smart_links_for_test_run`

  const payload = {
    project_id: projectId,
    environment: environment,
    test_run_id: testRunId,
  }

  const fetcher = () =>
    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(res => res.json())

  const { data, mutate, error } = useSWR(url, fetcher)

  const loading = !data && !error
  const noData = !data

  return { loading, noData, smartLinks: data, mutate }
}
