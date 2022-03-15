const cron = require('cron')
const moment = require('moment-timezone')
const { scrapingController } = require('./build/src/controllers')

// const runRoutine = () => {
//   scrapingController.routine()
// }

// var threeSecondInterval = function(){
//   console.log("Isso é a clock function?");
// }
// setInterval(threeSecondInterval, 3000)

// //For specific times, use a chron job
// var fifteenSeconsAfterMinute = function() {
// console.log("Another minute is gone forever. Hopefully, you made the most of it...");
// }

// new cron.CronJob({
//   cronTime: "*/3 * * * * *", //every three minutes
//   // onTick: runRoutine,
//   start: true,
//   timeZone: "America/Sao_Paulo"
// })
new cron.CronJob(
  "*/10 * * * *",
  async () => {
    console.log('executando coleta!')
    console.log(moment().tz('America/Sao_Paulo').format('DD-MM-YYYY HH:mm:ss'))
    // await scrapingController.routine()
  },
  () => {},
  true,
  "America/Sao_Paulo"
)