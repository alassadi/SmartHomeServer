
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const rooms = require('./rooms');
const devices = require('./devices');
const units = require('./units');
const users = require('./users');

const funs = {
  helloWorld: functions.https.onRequest((req, res) => {
    res.send('Hello from a Serverless Database!');
  }),
  ...rooms,
  ...devices,
  ...units,
  ...users
};

module.exports = funs;
