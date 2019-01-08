const functions = require('firebase-functions');
const cors = require('cors')({
  origin: true
});
const admin = require('firebase-admin');
const realTimeDatabase = admin.database();
const dbref = realTimeDatabase.ref();
const authMiddleware = require('../middleware/auth');
const inputValidation = require('../middleware/inputValidation');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(require('cors')({ origin: true }));
app.use(cookieParser);
app.use(bodyParser.json());
app.use(authMiddleware);

/**
 * Gets ALL the devices in the house, or all devices in a room.
 * To get all devices in the house, send a GET request such as:
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/devices
 */
app.get('/', (req, res) => {
  const devicesRef = dbref.child('Devices');
  devicesRef.on('value', function (snapshot) {
    return res.status(200).json(snapshot.val());
  });
});

app.get('/codable/', (req, res) => {
  const devicesRef = dbref.child('Devices');
  devicesRef.on('value', function (snapshot) {
      let deviceList = [];
      snapshot.forEach(function(childSnapshot) {
          let childKey = childSnapshot.key;
          let item = {
              id: childKey,
              name: childSnapshot.child('name').val(),
              room_id: childSnapshot.child('room_id').val(),
              value: childSnapshot.child('value').val()
          };
          deviceList.push(item)
      });
    return res.status(200).json(deviceList)
  })
});

/** 
 * With URL parameters:
 * Send a POST request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/devices/my9iXu6WvEgx5oNLLegs
 * with JSON:
 * { "enabled": true }
 * to change device status
 * Send a GET request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/devices/my9iXu6WvEgx5oNLLegs
 * to read device status
 * @type {HttpsFunction}
 */

app.get('/:id', (req, res) => {
  const devicesRef = dbref.child('Devices');
  devicesRef.on('value', function (snapshot) {
    return res.status(200).json(snapshot.child(req.params.id).val());
  });
});

app.post('/:id', inputValidation, (req, res) => {
  dbref.child('Devices/' + req.params.id)
    .update(req.body)
    .then(res.status(200).json(req.body))
    .catch(err => {
      console.log('Error updating database', err);
    });
});

module.exports.devices = functions.region('europe-west1').https.onRequest(app);

/**
 * Function called when the status of any device is updated
 * on the realtime database
 * @type {CloudFunction<Change<DataSnapshot>>}
 */
module.exports.onDeviceUpdated = functions.region('europe-west1').database.ref('Devices').onUpdate(({ after: device }) => {
  admin.messaging().send({
    data: {
      id: device.key,
      data: device.val()
    },
    topic: 'deviceUpdate'
  })
    .then(response => console.log(`Successfully sent message: ${response}`))
    .catch(error => console.log(`Error sending message ${error}`));
});

/**
 * Checks user authentication. ID token
 * needs to be fetched on the front end after
 * the user has been created
 * @param req
 * @param res
 */
const authentication = (req, res) => {
  cors(req, res, () => {
    const tokenId = req.get('Authorization').split('Bearer ')[1];

    return admin.auth().verifyIdToken(tokenId)
      .then(function(decodedToken) {
        var uid = decodedToken.uid;
        console.log('Authorized request');
        return uid;
      })
      .catch((err) => {res.status(401).send(err);
        console.log('Unauthorized request');
        return null;
      });
  });
};