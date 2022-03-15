const cron = require('cron')
// const { scrapingController } = require('./build/src/controllers')

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
  "* 1 * * *",
  async () => {
    console.log('sou uma cron')
    const date = new Date()
    console.log('day: ', date.getDay(), 'hours: ', date.getHours(), 'minutes: ', date.getMinutes());
  },
  () => {},
  true,
  "America/Sao_Paulo"
)