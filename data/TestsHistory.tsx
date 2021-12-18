import useSWR from "swr"

const fetcher = url => fetch(url).then(res => res.json())

export default function getTestHistory(
  mother_test_id: number
): { loading; noData; test_history; mutate } {
  const { data, mutate, error } = useSWR(
    `${
      process.env.publicDeltaCore
    }/api/v1/test_history/test_id/${mother_test_id}`,
    fetcher,
    { refreshInterval: 3000 }
  )

  const loading = !data && !error
  const noData = !data

  return { loading, noData, test_history: data, mutate }
}
