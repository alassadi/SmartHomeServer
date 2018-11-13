const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true
});

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const database = admin.firestore();
const realTimeDatabase = admin.database();
const dbref = realTimeDatabase.ref();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.write('you posted:\n')
    res.end(JSON.stringify(req.body, null, 2))
});


exports.helloWorld = functions.https.onRequest((req, res) => {
    res.send("Hello from a Serverless Database!");
});

const getRoomsFromDatabase = (res) => {
    let rooms = [];

    return database.collection('Rooms').get()
        .then((snapshot) => {
            snapshot.forEach((room_number) => {
                rooms.push({
                    id: room_number.id,
                    number: room_number.data()
                });
            });
            res.status(200).json(rooms);
        }, (error) => {
            res.status(error.code).json({
                message: `Something went wrong. ${error.message}`
            })
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};


exports.getRooms = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(401).json({
                message: 'Not allowed'
            });
        };
        //console.log(req.query);
        getRoomsFromDatabase(res);
    });
});


const getRoomDevices = (res,req) => {
  let devices = [];

  return database.collection('Devices').where('roomUUID', '==', req.query.id).get()
      .then((snapshot) => {
          snapshot.forEach((name) => {
              devices.push({
                  device_id: name.id,
                  details: name.data()
              });
          });
          res.status(200).json(devices);
      }, (error) => {
          res.status(error.code).json({
              message: 'Something went wrong. ${error.message}'
          })
      })
      .catch((err) => {
          console.log('Error getting documents', err);
      });
};


exports.getRoomDevices = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      if (req.method !== 'GET') {
          return res.status(401).json({
              message: 'Not allowed'
          });
      };
      getRoomDevices(res,req);
  });
});


const turnOnDevice = (res, req) => {
  return database.collection('Devices').doc(req.query.id).update({'enabled': true})
      .then(res.status(200).json({
        // here we shd get confirmation from the gateway first, but this is for testing purposes 
          [req.query.id] : 'Device is On'
    }))
      .catch((err) => {
          console.log('Error getting documents', err);
      });
};


exports.turnOnDevice = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      if (req.method !== 'GET') {
          return res.status(401).json({
              message: 'Not allowed'
          });
      };
      turnOnDevice(res,req);
  });
});

const turnOffDevice = (res, req) => {
  return database.collection('Devices').doc(req.query.id).update({'enabled': false})
      .then(res.status(200).json({
          //we shd check if the key exists before sending the rest
        // here we shd get confirmation from the gateway first, but this is for testing purposes 
          [req.query.id]: 'Device is Off'
    }))
      .catch((err) => {
          console.log('Error getting documents', err);
      });
};


exports.turnOffDevice = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      if (req.method !== 'GET') {
          return res.status(401).json({
              message: 'Not allowed'
          });
      };
      turnOffDevice(res,req);
  });
});

const updateDeviceStatus = (res, req) => {
    return dbref.child('Devices/' + req.query.id).update({'enabled': req.query.enabled})
        .then(res.status(200).json(
            req.query.enabled
        ))
        .catch((err) => {
                console.log('Error updating database', err);
            }
        );
};

/**
 * Send a POST request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/updateDeviceStatus?id=my9iXu6WvEgx5oNLLegs&enabled=true
 * to confirm that the device is turned on, and
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/updateDeviceStatus?id=my9iXu6WvEgx5oNLLegs&enabled=false
 * to confirm that the device is turned off
 * @type {HttpsFunction}
 */
module.exports.updateDeviceStatus = functions.region('europe-west1').https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(400).json({
                message: 'Bad request. Send a POST request'
            });
        }
        updateDeviceStatus(res, req);
    }) ;
});

/**
 * Updates device through JSON in the form:
 * { "id": "my9iXu6WvEgx5oNLLegs", "enabled": true }
 * @type {HttpsFunction}
 */
module.exports.updateDeviceThroughJson = functions.region('europe-west1').https.onRequest((req, res) => {

    return dbref.child('Devices/' + req.body.id).update({'enabled': req.body.enabled})
        .then(res.status(200).json(
            req.body.enabled
        ))
        .catch((err) => {
                console.log('Error updating database', err);
            }
        );
})

module.exports.updateDeviceThroughJsonEu = functions.region('europe-west1').https.onRequest((req, res) => {

    return dbref.child('Devices/' + req.body.id).update({'enabled': req.body.enabled})
        .then(res.status(200).json(
            req.body.enabled
        ))
        .catch((err) => {
                console.log('Error updating database', err);
            }
        );
})



const getDeviceFromDB = (res, req) => {

    var devicesRef = dbref.child('Devices');
    devicesRef.on('value', function(snapshot) {
        return res.status(200).json(
            snapshot.child(req.query.id).val()
    );

    });
};

/**
 * Send a GET request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/getDeviceFromDB?id=my9iXu6WvEgx5oNLLegs
 * @type {HttpsFunction}
 */
module.exports.getDeviceFromDB = functions.region('europe-west1').https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(400).json({
                message: 'Bad request. Send a GET request'
            });
        }
        getDeviceFromDB(res, req);
    }) ;
});


/**
 * Send a POST request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/getDeviceFromDBJson
 * with JSON such as { "id" = "my9iXu6WvEgx5oNLLegs" }
 * @type {HttpsFunction}
 */
module.exports.getDeviceFromDBJson = functions.region('europe-west1').https.onRequest((req, res) => {
    var devicesRef = dbref.child('Devices');
    devicesRef.on('value', function (snapshot) {
        return res.status(200).json(
            snapshot.child(req.body.id).val()
        );
    });
});



/**
 * Function called when the status of the light bulb is updated
 * on the firestore database
 * @type {CloudFunction<Change<DocumentSnapshot>>}
 */
module.exports.onDeviceUpdated = functions.region('europe-west1').firestore
    .document('Devices/my9iXu6WvEgx5oNLLegs').onUpdate((change, context) => {
            console.log('the device status on firestore db has been updated');
            return change.after.data();
    });

/**
 * Function called when the status of the light bulb is updated
 * on the realtime database
 * @type {CloudFunction<Change<DataSnapshot>>}
 */
module.exports.onDeviceUpdatedRealtime = functions.region('europe-west1').database.
ref('Devices/my9iXu6WvEgx5oNLLegs').onUpdate((snapshot, context) => {
    console.log('the device status on realtime db has been updated');
});



