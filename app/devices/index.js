const functions = require('firebase-functions');
const cors = require('cors')({
  origin: true
});
const admin = require('firebase-admin');
const database = admin.firestore();

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
  
  
module.exports.turnOnDevice = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    }
    turnOnDevice(res,req);
  });
});
  
const turnOffDevice = (res, req) => {
  return database.collection('Devices').doc(req.query.id).update({'enabled': false})
    .then(res.status(200).json({
      //we shd check if the key exists before sending the res
      // here we shd get confirmation from the gateway first, but this is for testing purposes 
      [req.query.id]: 'Device is Off'
    }))
    .catch((err) => {
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
    turnOffDevice(res,req);
  });
});