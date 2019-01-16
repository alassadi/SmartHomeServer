const functions = require('firebase-functions');
const cors = require('cors');
const authMiddleware = require('../middleware/auth');
const cookieParser = require('cookie-parser')();
const admin = require('firebase-admin');
const realTimeDatabase = admin.database();
const dbref = realTimeDatabase.ref();
const express = require('express');

const app = express();

app.use(cors({ origin: true }));
app.use(cookieParser);
app.use(authMiddleware);
app.get('/', (req, res) => getRoomsFromDatabase(res));
app.get('/:id', (req, res) => getRoomDevices(req.params.id, req, res));
app.get('/codable/:id', (req, res) => getRoomDevicesIos(req, res));

const getRoomsFromDatabase = (res) => {
  const roomsRef = dbref.child('Rooms');

  roomsRef.once('value', function (snapshot) {
    return res.status(200).json(snapshot.val());
  });
};

const getRoomDevices = (id, req, res) => {
  const devicesRef = dbref.child('Devices');
  devicesRef.orderByChild('room_id').equalTo(req.params.id).once('value', function (snapshot) {
    return res.status(200).json(snapshot.val());
  });
};

const getRoomDevicesIos = (req, res) => {
  const devicesRef = dbref.child('Devices');
  const roomId = req.params.id;
  devicesRef.orderByChild('room_id').equalTo(roomId).once('value', function (snapshot) {
    let deviceList = [];
    snapshot.forEach(function(childSnapshot) {
      let childKey = childSnapshot.key;
      let item = {
        id: childKey,
        name: childSnapshot.child('name').val(),
        room_id: childSnapshot.child('room_id').val(),
        value: childSnapshot.child('value').val()
      };
      deviceList.push(item);
    });
    return res.status(200).json(deviceList);
  });
};

module.exports.rooms = functions.region('europe-west1').https.onRequest(app);