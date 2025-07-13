import fs from 'fs'
import path from 'path'
import pino from 'pino'

const logDir = path.join(process.cwd(), 'logs')
const dateStr = new Date().toISOString().slice(0, 10)
const logStream = fs.createWriteStream(`${logDir}/${dateStr}.log`, { flags: 'a' })

export const logger = pino({
	level: 'debug',
	hooks: {
		logMethod(args, method, level) {
			const [msg, ...rest] = args

			try {
				const logData = JSON.stringify({
					level,
					time: new Date().toISOString(),
					msg,
					detail: rest,
				})

				if (process.env.NODE_ENV !== 'production') {
					logStream.write(`${logData}\n`)
				}
			} catch (err) {
				console.error('Logger error', { err })
			}

			return method.apply(this, args)
		},
	},
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'SYS:standard',
			ignore: 'pid,hostname',
		},
	},
})
