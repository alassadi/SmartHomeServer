'use strict';

const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true
});

const admin = require('firebase-admin');

const database = admin.firestore();
const realTimeDatabase = admin.database();
const dbref = realTimeDatabase.ref();

const turnOnDevice = (res, req) => {
    return database.collection('Devices').doc(req.query.id).update({ 'enabled': true }).then(res.status(200).json({
        // here we shd get confirmation from the gateway first, but this is for testing purposes
        [req.query.id]: 'Device is On'
    })).catch(err => {
        console.log('Error getting documents', err);
    });
};

module.exports.turnOnDevice = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(401).json({
                message: 'Not allowed'
            });
        }
        turnOnDevice(res, req);
    });
});

const turnOffDevice = (res, req) => {
    return database.collection('Devices').doc(req.query.id).update({ 'enabled': false }).then(res.status(200).json({
        //we shd check if the key exists before sending the res
        // here we shd get confirmation from the gateway first, but this is for testing purposes
        [req.query.id]: 'Device is Off'
    })).catch(err => {
        console.log('Error getting documents', err);
    });
};

module.exports.turnOffDevice = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(401).json({
                message: 'Not allowed'
            });
        }
        turnOffDevice(res, req);
    });
});

/** Send a PUT request such as
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
 * @type {HttpsFunction}
 */
module.exports.device = functions.region('europe-west1').https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method === 'POST') {
            var devicesRef = dbref.child('Devices');
            devicesRef.on('value', function (snapshot) {
                return res.status(200).json(snapshot.child(req.body.id).val());
            });
        } else if (req.method === 'PUT') {
            return dbref.child('Devices/' + req.body.id).update({ 'enabled': req.body.enabled }).then(res.status(200).json({
                'enabled': req.body.enabled
            })).catch(err => {
                console.log('Error updating database', err);
            });
        }
    });
});

/** Send a POST request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/device_url?id=my9iXu6WvEgx5oNLLegs&enabled=true
 * to turn device on, and
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/device_url?id=my9iXu6WvEgx5oNLLegs&enabled=false
 * to turn device off
 * @type {HttpsFunction}
 * Send a GET request such as
 * https://europe-west1-smarthome-3c6b9.cloudfunctions.net/device_url?id=my9iXu6WvEgx5oNLLegs
 * to read device status
 * @type {HttpsFunction}
 */
module.exports.device_url = functions.region('europe-west1').https.onRequest((req, res) => {
    return cors(req, res, () => {
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
    });
});


/**
 * Function called when the status of the light bulb is updated
 * on the realtime database
 * @type {CloudFunction<Change<DataSnapshot>>}
 */
module.exports.onDeviceUpdated = functions.region('europe-west1').database.ref('Devices').onUpdate((snapshot, context) => {
    console.log('the status of devices on realtime db has been updated');
});