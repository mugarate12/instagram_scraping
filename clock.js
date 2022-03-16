const cron = require('cron')
const moment = require('moment-timezone')
const { scrapingController } = require('./build/src/controllers')

new cron.CronJob(
  "*/10 * * * *",
  async () => {
    console.log('executando coleta!')
    console.log(moment().tz('America/Sao_Paulo').format('DD-MM-YYYY HH:mm:ss'))
    
    await scrapingController.routine()
    console.log('coleta efetuada!')
  },
  () => {},
  true,
  "America/Sao_Paulo"
)