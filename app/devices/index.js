'use strict';

const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true
});

const admin = require('firebase-admin');

const realTimeDatabase = admin.database();
const dbref = realTimeDatabase.ref();


/** With JSON:
 * Send a PUT request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/device
 * with JSON:
 * { "id": "my9iXu6WvEgx5oNLLegs", "enabled": true }
 * to turn device on, and
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/device
 * with JSON:
 * {"id": "my9iXu6WvEgx5oNLLegs", "enabled": false }
 * to turn device off
 * Send a POST request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/device
 * with JSON:
 * { "id": "my9iXu6WvEgx5oNLLegs"}
 * to read device status
 *
 * With URL parameters:
 * Send a POST request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/device_url?id=my9iXu6WvEgx5oNLLegs&enabled=true
 * to turn device on, and
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/device_url?id=my9iXu6WvEgx5oNLLegs&enabled=false
 * to turn device off
 * Send a GET request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/device_url?id=my9iXu6WvEgx5oNLLegs
 * to read device status
 * @type {HttpsFunction}
 */
module.exports.device = functions.region('europe-west1').https.onRequest((req, res) => {

    //if (module.exports.authentication(req, res)) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        if (req.method === 'GET') {
            var devicesRef = dbref.child('Devices');
            devicesRef.on('value', function (snapshot) {
                return res.status(200).json(snapshot.child(req.query.id).val());
            });
        } else if (req.method === 'POST') {
            return dbref.child('Devices/' + req.query.id).update({ 'enabled': req.query.enabled }).then(res.status(200).json({
                'enabled': req.query.enabled
            })).catch(err => {
                console.log('Error updating database', err);
            });
        }
    } else {
        if (req.method === 'POST') {
            var devicesRef = dbref.child('Devices');
            devicesRef.on('value', function (snapshot) {
                return res.status(200).json(snapshot.child(req.body.id).val());
            });
        } else if (req.method === 'PUT') {
            return dbref.child('Devices/' + req.body.id).update({'enabled': req.body.enabled}).then(res.status(200).json({
                'enabled': req.body.enabled
            })).catch(err => {
                console.log('Error updating database', err);
            });
        }
        //}
    }});



/**
 * Function called when the status of the light bulb is updated
 * on the realtime database
 * @type {CloudFunction<Change<DataSnapshot>>}
 */
module.exports.onDeviceUpdated = functions.region('europe-west1').database.ref('Devices').onUpdate((snapshot, context) => {
    console.log('the status of devices on realtime db has been updated');
});

/**
 * Checks user authentication. ID token
 * needs to be fetched on the front end after
 * the user has been created
 * @param req
 * @param res
 */
module.exports.authentication = function authentication(req, res) {
    cors(req, res, () => {
        const tokenId = req.get('Authorization').split('Bearer')[1];

        return admin.auth().verifyIdToken(tokenId)
            .then((decoded) =>  {res.status(200).send(decoded)
                console.log("Authorized request")
                return true
            })
            .catch((err) => {res.status(401).send(err)
                console.log("Unauthorized request")
                return false
            });
    });
};