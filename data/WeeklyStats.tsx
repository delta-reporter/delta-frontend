import useSWR from "swr"

const fetcher = url => fetch(url).then(res => res.json())

export default function getWeeklyStats(project_id: number) {
  const {
    data,
    mutate,
    error,
  } = useSWR(
    `${process.env.publicDeltaCore}/api/v1/weekly_stats/${project_id}`,
    fetcher
  )

  const loading = !data && !error
  const noData = !data

  return { loading, noData, weekly_stats: data, mutate }
}
