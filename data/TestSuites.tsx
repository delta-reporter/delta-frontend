import useSWR from "swr"

const fetcher = url => fetch(url).then(res => res.json())

export default function getTestSuites(testRunId: number, stats: string) {
  const { data, mutate, error } = useSWR(
    `${
      process.env.publicDeltaCore
    }/api/v1/tests_suites_history/test_status/${stats.toString()}/test_run/${testRunId}`,
    fetcher,
    { refreshInterval: 3000 }
  )

  const loading = !data && !error
  const noData = !data

  return { loading, noData, testSuites: data, mutate }
}
