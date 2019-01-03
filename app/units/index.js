const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
    origin:true
});

exports.unit = functions.region('europe-west1').https.onRequest((req, res) => {
    return cors(req, res, () => {
        const dbref = admin.database().ref();
        let unit_uid = '';
        let user_uid = '';
        if (req.method === 'PUT' || req.method === 'GET') {
            if (req.query.hasOwnProperty('unit_uid')) {
                unit_uid = req.query.unit_uid;
            } else if (req.body.hasOwnProperty('unit_uid')) {
                unit_uid = req.body.unit_uid
            } else {
                return res.status(400).json({
                    message: "No Unit ID is available in JSON body or URL"
                });
            }
            if (req.query.hasOwnProperty('user_uid')) {
                user_uid = req.query.user_uid;
            } else if(req.body.hasOwnProperty('user_uid')) {
                user_uid = req.body.user_uid;
            } else {
                return res.status(400).json({
                    message: "No user id present in url or JSON body."
                });
            }
        }
        if (req.method === 'POST') {
            const data = req.body;
            dbref.child('Users').child(data.user_uid).child('Units').push({
                unit_type : data.unit_type.toString(),
                fcm_token : data.fcm_token.toString()
            }).then((unit) => {
                return res.status(200).json({
                    message: 'Unit registered successfully',
                    uid: unit.key
                })
            }).catch((error) => {
                res.json({
                    message: "error" + error.toString()
                })
            })
        }
        else if (req.method === 'PUT') {
            return res.status(401).json({
                message: 'PUT Denied, please use updateFcmToken endpoint to update this unit\'s fcm_token'
            })
        }
        else if (req.method === 'GET') {
            let unit = dbref.child('Users').child(user_uid).child('Units');
            unit.once('value').then((snapshot) => {
                if(!snapshot.child(unit_uid).exists()) {
                    return res.status(404).json({
                        message: 'Unit with specified UID does not exist.'
                    })
                }
            });
            if (unit_uid === '') {
                return res.status(400).json({
                    message: 'Denied. Uid must be present either as a URL parameter or as part of the request body.'
                })
            }
            unit.on('value', function (snapshot) {
                return res.status(200).json(
                    snapshot.child(unit_uid).val()
                );
            })
        }
    })
});

exports.units = functions.region('europe-west1').https.onRequest((req, res) => {
    return cors(req, res, () => {
        const dbref = admin.database().ref();
        if (req.method !== 'GET') {
            return res.status(401).json({
                message: 'Denied. Units endpoint is read-only.'
            })
        }

        let user_uid = '';
        if (req.query.hasOwnProperty('user_uid')) {
            user_uid = req.query.user_uid;
        } else if (req.body.hasOwnProperty('user_uid')) {
            user_uid = req.body.user_uid
        } else {
            return res.status(400).json({
                message: "No User UID is available in JSON body or URL"
            });
        }

        let allUnits = dbref.child('Users').child(user_uid).child('Units');

        allUnits.once('value').then((snapshot) => {
            if(!snapshot.exists()) {
                return res.status(404).json({
                    message: 'User has no units.'
                })
            }
        });

        allUnits.on('value', function (snapshot) {
            return res.status(200).json(
                snapshot.val()
            );
        })
    })
});

exports.updateFcmToken = functions.region('europe-west1').https.onRequest((req, res) => {
    const dbref = admin.database().ref();
    if(req.method !== "PUT") {
        return res.status(400).json({
            message: "Bad request, PUT Required"
        })
    }
    const data = req.body;
    dbref.child('Users').child(data.user_uid).child('Units').child(data.unit_uid).update({
        fcm_token : data.fcm_token.toString()
    })
        .then(() => {
            console.log("FCM Token added to client for user: " + data.user_uid);
            return res.status(200).json({
                message: "Fcm token registered"
            })
        }).catch((error) => {
        res.json({
            message: "error" + error.toString()
        })
    })
});