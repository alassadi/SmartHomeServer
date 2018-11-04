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

