const functions = require('firebase-functions');
const admin = require('firebase-admin');
const authMiddleware = require('../middleware/auth');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(require('cors')({ origin: true }));
app.use(cookieParser);
app.use(bodyParser.json());
app.use(authMiddleware);

app.get('/:id', (req, res) => {
  const dbref = admin.database().ref();
  const unit_uid = req.params.id;
  const user_uid = req.user.uid;
  const unit = dbref.child('Users').child(user_uid).child('Units');
  unit.once('value').then((snapshot) => {
    if(!snapshot.child(unit_uid || '').exists()) {
      return res.status(404).json({
        message: 'Unit with specified UID does not exist.'
      });
    }
  });
  unit.on('value', function (snapshot) {
    return res.status(200).json(
      snapshot.child(unit_uid).val()
    );
  });
});

app.post('/:id', (req, res) => {
  const dbref = admin.database().ref();
  const unit_uid = req.params.id;
  const user_uid = req.user.uid;
  const unit = dbref.child('Users').child(user_uid).child('Units');
  const data = req.body;
  unit.once('value').then((snapshot) => {
    if(!snapshot.child(unit_uid || '').exists()) {
      return res.status(404).json({
        message: 'Unit with specified UID does not exist.'
      });
    }
  });
  unit.push({
    unit_type : data.unit_type.toString(),
    fcm_token : data.fcm_token.toString()
  }).then((unit) => {
    return res.status(200).json({
      message: 'Unit registered successfully',
      uid: unit.key
    });
  }).catch((error) => {
    res.json({
      message: 'error' + error.toString()
    });
  });
});

app.put('/:id', (req, res) => {
  const dbref = admin.database().ref();
  const unit_uid = req.params.id;
  const user_uid = req.user.uid;
  const data = req.body;
  dbref.child('Users').child(user_uid).child('Units').child(unit_uid).update({
    fcm_token : data.fcm_token.toString()
  })
    .then(() => {
      console.log('FCM Token added to client for user: ' + user_uid);
      return res.status(200).json({
        message: 'Fcm token registered'
      });
    }).catch((error) => {
      res.json({
        message: 'error' + error.toString()
      });
    });
});

app.get('/', (req, res) => {
  const dbref = admin.database().ref();
  const user_uid = req.user.uid;
  console.log(user_uid);
  const allUnits = dbref.child('Users').child(user_uid).child('Units');

  allUnits.once('value').then((snapshot) => {
    if(!snapshot.exists()) {
      return res.status(404).json({
        message: 'User has no units.'
      });
    } else {
      res.status(200).json(
        snapshot.val()
      );
    }   
  });
});

exports.units = functions.region('europe-west1').https.onRequest(app);

const updateFcmToken = functions.region('europe-west1').https.onRequest((req, res) => {
  const dbref = admin.database().ref();
  if(req.method !== 'PUT') {
    return res.status(400).json({
      message: 'Bad request, PUT Required'
    });
  }
  const data = req.body;
  dbref.child('Users').child(data.user_uid).child('Units').child(data.unit_uid).update({
    fcm_token : data.fcm_token.toString()
  })
    .then(() => {
      console.log('FCM Token added to client for user: ' + data.user_uid);
      return res.status(200).json({
        message: 'Fcm token registered'
      });
    }).catch((error) => {
      res.json({
        message: 'error' + error.toString()
      });
    });
});