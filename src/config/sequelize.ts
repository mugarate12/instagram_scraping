import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const applicationType = String(process.env.NODE_ENV)

let databaseName = ''
let databaseUser = ''
let databaseHost = ''
let databasePassword = ''

if (applicationType === 'development') {
  databaseName = String(process.env.DEV_DATABASE_DATABASE)
  databaseUser = String(process.env.DEV_DATABASE_USERNAME)
  databaseHost = String(process.env.DEV_DATABASE_HOST)
  databasePassword = String(process.env.DEV_DATABASE_PASSWORD)
} else if (applicationType === 'test') {
  databaseName = String(process.env.TEST_DATABASE_DATABASE)
  databaseUser = String(process.env.TEST_DATABASE_USERNAME)
  databaseHost = String(process.env.TEST_DATABASE_HOST)
  databasePassword = String(process.env.TEST_DATABASE_PASSWORD)
} else {
  databaseName = String(process.env.PROD_DATABASE_DATABASE)
  databaseUser = String(process.env.PROD_DATABASE_USERNAME)
  databaseHost = String(process.env.PROD_DATABASE_HOST)
  databasePassword = String(process.env.PROD_DATABASE_PASSWORD)
}

const connection = new Sequelize(databaseName, databaseUser, databasePassword, {
  host: databaseHost,
  dialect: 'mysql'
})

export default connection
