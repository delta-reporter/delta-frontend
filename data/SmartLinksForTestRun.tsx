import useSWR from "swr"

export default function getSmartLinksForTestRun(
  project_id: number,
  environment: string,
  test_run_id: number
): { loading; noData; smart_links; mutate } {
  const url = `${process.env.publicDeltaCore}/api/v1/smart_links_for_test_run`

  const payload = {
    project_id: project_id,
    environment: environment,
    test_run_id: test_run_id,
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

  return { loading, noData, smart_links: data, mutate }
}
