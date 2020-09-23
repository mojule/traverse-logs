import { outputLogEntries } from '.'

const isWeather = ( head: any ) => 
  typeof head === 'string' && head.trim().endsWith('Weather')

const isSeparator = ( s: string ) =>  s.trim() === '-'.repeat( 80 )

const isWeatherData = ( s: string ) => !isSeparator( s )

const getWeather = (entry: string[]) => {
  let [head, ...rest] = entry

  if( !isWeather( head )) return

  rest = rest.filter( s => s.trim() === '-'.repeat( 80 ) )

  const json = rest.filter( isWeatherData ).join('').trim()

  if (json === '') throw Error('Unexpected empty weather')

  const { temperatureC: t, rainMM: r } = JSON.parse(json)

  let temperatureC = Number.NEGATIVE_INFINITY
  let rainMM = Number.NEGATIVE_INFINITY

  if (typeof t === 'number') temperatureC = t
  if (typeof r === 'number') rainMM = r

  return { temperatureC, rainMM }
}

outputLogEntries( './data', getWeather )
