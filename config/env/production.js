'use strict';

module.exports = {
  db: process.env.MONGOLAB_URI,
  sessionSecret: process.env.sessionSecret,
  twilio: {
    ACCOUNT_SID: 'AC737893ca471765a75aec4fecf0b4838e',
    AUTH_TOKEN: '4e15cbbc2371bb056c6033cdb2205557',
    myNumber: '+12342030309'
  }
}
