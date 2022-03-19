import Cron from "cron"
import moment from "moment-timezone"

import {
  scrapingController
} from "../controllers/index"
import {
  logger
} from  './../utils'

const everyThreeHours = '0 */3 * * *'

const instagramScraping = new Cron.CronJob(everyThreeHours, async () => {
  const routineInitialDate = moment().tz('America/Sao_Paulo').format('DD-MM-YYYY HH:mm:ss')

  logger.info(`${routineInitialDate}: executando coleta...`)

  await scrapingController.routine()
    .catch(() => {
      logger.error(`${routineInitialDate}: erro na coleta!`)
    })

  logger.info(`${routineInitialDate}: coleta realizada!`)
})

export default function runScrapingRoutine() {
  instagramScraping.start()
}
