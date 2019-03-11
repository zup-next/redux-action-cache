export const getDate = () => new Date().getTime()

export const isExpired = (lastUpdated: number, validity: number) => {
  const now = getDate()
  const validityMS = validity * 1000
  const ellapsed = now - lastUpdated

  return ellapsed >= validityMS
}
