import useSWR from "swr"

const fetcher = url => fetch(url).then(res => res.json())

export default function getTests(test_suite_history_id: number, stats: string) {
  const { data, mutate, error} = useSWR(
    `${process.env.publicDeltaCore}/api/v1/tests/test_status/${stats.toString()}/test_suite_history/${test_suite_history_id}`,
    fetcher, { refreshInterval: 3000 }
  )

  const loading = !data && !error
  const noData = !data

  return {
    loading,
    noData,
    tests: data,
    mutate
  };
}