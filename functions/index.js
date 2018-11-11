
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const rooms = require('./rooms');
const devices = require('./devices');

const funs = {
  helloWorld: functions.https.onRequest((req, res) => {
    res.send('Hello from a Serverless Database!');
  }),
  ...rooms,
  ...devices
};

module.exports = funs;