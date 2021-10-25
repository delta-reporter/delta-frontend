import useSWR from "swr"

const fetcher = url => fetch(url).then(res => res.json())

export default function getTests(
  testSuiteHistoryId: number,
  stats: string
): { loading; noData; tests; mutate } {
  const { data, mutate, error } = useSWR(
    `${
      process.env.publicDeltaCore
    }/api/v1/tests/test_status/${stats.toString()}/test_suite_history/${testSuiteHistoryId}`,
    fetcher,
    { refreshInterval: 3000 }
  )

  const loading = !data && !error
  const noData = !data

  return { loading, noData, tests: data, mutate }
}
