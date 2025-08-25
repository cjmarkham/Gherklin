import winston, { format } from 'winston'
const { printf, colorize, combine } = format

const simpleWithoutPrefix = printf((info): string => {
  return info.message as string
})

const logger = (): winston.Logger => {
  return winston.createLogger({
    level: 'info',
    format: combine(colorize(), simpleWithoutPrefix),
    transports: new winston.transports.Console(),
  })
}

export default logger()
