const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true
});

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const database = admin.firestore();


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
    return database.collection('Devices').doc(req.query.id).update({'enabled': req.query.enabled})
        .then(res.status(200).json({
            message: [req.query.enabled]
        }))
        .catch((err) => {
                console.log('Error updating database', err);
            }
        );
};

/**
 * Send a POST request such as
 * https://us-central1-smarthome-3c6b9.cloudfunctions.net/updateDeviceStatus?id=my9iXu6WvEgx5oNLLegs&enabled=true
 * to confirm that the device is turned on, and
 * https://us-central1-smarthome-3c6b9.cloudfunctions.net/updateDeviceStatus?id=my9iXu6WvEgx5oNLLegs&enabled=false
 * to confirm that the device is turned off
 * @type {HttpsFunction}
 */
exports.updateDeviceStatus = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Invalid operation'
            });
        }
        updateDeviceStatus(res, req);
    }) ;
});


const getDeviceFromDB = (res, req) => {

    var docRef = database.collection("Devices").doc(req.query.id);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            return res.status(200).json({
                [req.query.id] : doc.data()
            });
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
};

/**
 * Send a GET request such as
 * https://us-central1-smarthome-3c6b9.cloudfunctions.net/getDeviceFromDB?id=my9iXu6WvEgx5oNLLegs
 * @type {HttpsFunction}
 */
exports.getDeviceFromDB = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(401).json({
                message: 'Invalid operation'
            });
        }
        getDeviceFromDB(res, req);
    }) ;
});

/**
 * Function called when the status of the light bulb is updated
 * on the database
 * @type {CloudFunction<Change<DocumentSnapshot>>}
 */
exports.onDeviceUpdated = functions.firestore
    .document('Devices/my9iXu6WvEgx5oNLLegs').onUpdate((change, context) => {
            console.log('the device status has been updated');
            return change.after.data();
    });