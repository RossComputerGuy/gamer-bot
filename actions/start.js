const bot = require('../index.js');

bot.boot().then(() => {}).catch(err => {
  if (bot.config('enableLogging')) {
   bot.loger.error(err);
   bot.destroy();
   process.exit(1);
  }
});

// vim:set ts=2 sw=2 et:
