const cron = require('cron')
const { scrapingController } = require('./build/src/controllers')

const runRoutine = () => {
  scrapingController.routine()
}

new cron.CronJob({
  cronTime: "*/3 * * * * *", //every three minutes
  onTick: runRoutine,
  start: true,
  timeZone: "America/Sao_Paulo"
})