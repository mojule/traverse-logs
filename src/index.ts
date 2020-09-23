import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

export const traverseLog = <T>(
  log: string,
  mapper: (entry: string[]) => T | undefined
) => {
  const entries = getLogEntries(log)
  const result: T[] = []

  entries.forEach(entry => {
    const current = mapper(entry)

    if (current) result.push(current)
  })

  return result
}

export const traverseDirectory = <T>(
  directoryPath: string,
  mapper: (entry: string[]) => T | undefined
) => {
  const result: Record<string, T[]> = {}

  const dir = readdirSync(directoryPath)

  dir.forEach(
    name => {
      if (!name.endsWith('.txt')) return

      const log = readFileSync(join(directoryPath, name), 'utf8')
      const current = traverseLog(log, mapper)

      if (current.length) result[name] = current
    }
  )

  return result
}

export const getLogEntries = (log = '') => {
  const lines = log.split('\n')

  const entries: string[][] = []

  let entry: string[] = []

  lines.forEach(l => {
    if (l.trim() === '='.repeat(80)) {
      entries.push(entry)
      entry = []

      return
    }

    entry.push(l)
  })

  return entries
}

export const outputLogEntries = <T>(
  directoryPath: string,
  mapper: (entry: string[]) => T | undefined
) => {
  try {
    const logData = traverseDirectory(directoryPath, mapper)
  
    const keys = Object.keys(logData)
  
    if( keys.length === 0 ){
      console.log( 'No relevant data found' )
    } else {
      keys.forEach(filename => {
        console.log('Filename:', filename)
      
        const data = logData[filename]
      
        data.forEach(datum => console.log(datum))
      }) 
    }
  } catch( err ){
    if( err.code === 'ENOENT' ){
      console.log( 
        `Could not find directoryPath ${ directoryPath }`
      )
    } else {
      console.error( err )
    }
  }
}