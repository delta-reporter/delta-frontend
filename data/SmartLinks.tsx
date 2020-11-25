import useSWR from "swr"

const fetcher = url => fetch(url).then(res => res.json())

export default function getSmartLinks(project_id: number) {
  const {
    data,
    mutate,
    error,
  } = useSWR(
    `${process.env.publicDeltaCore}/api/v1/smart_links/${project_id}`,
    fetcher,
    { refreshInterval: 2000 }
  )

  const loading = !data && !error
  const noData = !data

  return { loading, noData, smart_links: data, mutate }
}
