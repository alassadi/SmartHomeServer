const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.registerUnit = functions.https.onRequest((req, res) => {
    const dbref = admin.firebase().ref();
    if(req.method !== "POST") {
        return res.status(400).json({
            message: "Bad request, POST Required"
        });
    }
    const data = req.body;
    dbref.child('Users').child(data.uid).child('Units').push({
        unit_type : data.unit_type.toString(),
        fcm_token : data.fcm_token.toString()
    }).then((unit) => {
        return res.status(200).json({
            message: 'Device registered successfully',
            uid: unit.key
        })
    }).catch((error) => {
        res.json({
            message: "error" + error.toString()
        })
    })
});

exports.updateFcmToken = functions.https.onRequest((req, res) => {
    const dbref = admin.firebase().ref();
    if(req.method !== "POST") {
        return res.status(400).json({
            message: "Bad request, POST Required"
        })
    }
    const data = req.body;
    dbref.child('Users').child(data.uid).child('Units').child(data.unit_uid).update({
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
});