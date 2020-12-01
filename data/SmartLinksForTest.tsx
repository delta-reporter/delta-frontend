import useSWR from "swr"

export default function getSmartLinksForTest(
  project_id: number,
  environment: string,
  test_id: number
): { loading; noData; smart_links; mutate } {
  const url = `${process.env.publicDeltaCore}/api/v1/smart_links_for_test`

  const payload = {
    project_id: project_id,
    environment: environment,
    test_id: test_id,
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
