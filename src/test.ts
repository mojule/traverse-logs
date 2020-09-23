import { outputLogEntries } from '.'

const isWeather = ( head: any ) => 
  typeof head === 'string' && head.trim().endsWith('Weather')

const isSeparator = ( s: string ) =>  s.trim() === '-'.repeat( 80 )

const isWeatherData = ( s: string ) => !isSeparator( s )

const getWeather = (entry: string[]) => {
  const [head, ...rest] = entry

  if( !isWeather( head )) return

  const json = rest.filter( isWeatherData ).join('').trim()

  if (json === '') throw Error('Unexpected empty weather')

  const { temperatureC: t, rainMM: r } = JSON.parse(json)

  let temperatureC = Number.NEGATIVE_INFINITY
  let rainMM = Number.NEGATIVE_INFINITY

  if (typeof t === 'number') temperatureC = t
  if (typeof r === 'number') rainMM = r

  if( rainMM === Number.NEGATIVE_INFINITY || rainMM === 0 ) return

  return { temperatureC, rainMM }
}

outputLogEntries( './data', getWeather )
