import dotenv from 'dotenv' 

import {
  Scraping
} from './models'

dotenv.config()

const applicationType = String(process.env.NODE_ENV)
const init = () => {
  Scraping.sync({
    alter: applicationType === 'development',
    force: applicationType === 'test'
  })
}

init()
