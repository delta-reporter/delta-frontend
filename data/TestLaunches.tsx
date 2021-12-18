import useSWR from "swr"

const fetcher = url => fetch(url).then(res => res.json())

export default function getTestLaunches(
  projectId: number
): { loading; noData; launches; mutate } {
  const { data, mutate, error } = useSWR(
    `${
      process.env.publicDeltaCore
    }/api/v1/launch/project/${projectId}`,
    fetcher,
    { refreshInterval: 3000 }
  )

  const loading = !data && !error
  const noData = !data

  return { loading, noData, launches: data, mutate }
}
