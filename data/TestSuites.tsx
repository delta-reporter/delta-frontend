import useSWR from "swr"

const fetcher = url => fetch(url).then(res => res.json())

export default function getTestSuites(test_run_id: number, stats: string) {
  const { data, mutate, error} = useSWR(
    `${process.env.publicDeltaCore}/api/v1/tests_history/test_status/${stats.toString()}/test_run/${test_run_id}`,
    fetcher
  )

  const loading = !data && !error
  const noData = !data

  return {
    loading,
    noData,
    testSuites: data,
    mutate
  };
}