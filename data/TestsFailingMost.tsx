import useSWR from "swr"

const fetcher = url => fetch(url).then(res => res.json())

export default function getMostFailedTests(project_id: number) {
  const {
    data,
    mutate,
    error,
  } = useSWR(
    `${process.env.publicDeltaCore}/api/v1/most_failed_tests/${project_id}`,
    fetcher
  )

  const loading = !data && !error
  const noData = !data

  return { loading, noData, most_failed_tests: data, mutate }
}
