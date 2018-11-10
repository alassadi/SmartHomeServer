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

exports.registerUnit = functions.https.onRequest((req, res) => {
    if(req.method !== "POST") {
        return res.status(400).json({
            message: "Bad request, POST Required"
        })
    } else {
        const data = req.body;
        database.collection('Users').doc(data.uid).collection('Units').add({
            unit_type : data.unit_type.toString(),
            fcm_token : data.fcm_token.toString()
        }).then((unit) => {
            return res.status(200).json({
                message: 'Device registered successfully with UID: ' + unit.uid
            })
        }).catch((error) => {
            res.json({
                message: "error" + error.toString()
            })
        })
    }
});

exports.updateFcmToken = functions.https.onRequest((req, res) => {
    if(req.method !== "POST") {
        return res.status(400).json({
            message: "Bad request, POST Required"
        })
    } else {
        const data = req.body;
        database.collection('Users').doc(data.uid).collection('Units').doc(data.unit_uid).update({
            fcm_token : data.fcm_token.toString()
        })
            .then(() => {
                console.log("FCM Token added to client for user: " + data.uid)
                return res.status(200).json({
                    message: "Fcm token registered"
                })
            }).catch((error) => {
            res.json({
                message: "error" + error.toString()
            })
        })
    }
});