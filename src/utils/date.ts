import moment from 'moment'

export const getDate = (date: string, format: string = 'D MMMM, YYYY') =>
  date ? moment(date).format(format) : moment().format(format)

export const addSeconds = (date: string, seconds: number) => moment(date).add(seconds, 'seconds')

export const isExpired = (date: string) => moment().isAfter(date)
