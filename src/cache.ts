
interface CacheProperties {
  name: string,
  validity: number,
  persist: boolean,
}

const Cache = () => {
  const getCacheStatus = (actionName: string) => {}
  const createCache = ({ name, validity, persist }: CacheProperties) => {}
  const removeCache = (actionName: string) => {}
  const persist = () => {}
  const load = () => {}

  return {
    getCacheStatus,
    createCache,
    removeCache,
    persist,
    load,
  }
}

export default Cache
