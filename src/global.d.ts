type CacheProperties = {
  name: string,
  validity?: number,
  persist: boolean,
}

type CacheObject = {
  lastUpdated: number,
  validity?: number,
  persist: boolean,
}

type CacheMap = {
  [key:string]: CacheObject,
}

type SetItemProperties = (key: string, value: string) => void

type GetItemProperties = (key: string) => string
