import Cron from "cron"
import moment from "moment-timezone"
import dotenv from "dotenv"	

import {
  scrapingController
} from "../controllers/index"
import {
  logger
} from  './../utils'

dotenv.config()

const instagramScraping = new Cron.CronJob(String(process.env.SCRAPING_ROUTINE_CRON_TIME), async () => {
  const routineInitialDate = moment().tz('America/Sao_Paulo').format('DD-MM-YYYY HH:mm:ss')

  logger.info(`${routineInitialDate}: executando coleta...`)

  await scrapingController.routine()
    .catch((error) => {
      logger.error(`${routineInitialDate}: erro na coleta!`)
      logger.error(`Erro: ${error}`)
    })

  logger.info(`${routineInitialDate}: coleta realizada!`)
})

export default function runScrapingRoutine() {
  instagramScraping.start()
}
