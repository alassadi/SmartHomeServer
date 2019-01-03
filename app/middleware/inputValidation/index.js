const admin = require('firebase-admin');

// Express middleware that validates if an input request is valid for a particular device.
module.exports = (req, res, next) => {
  const deviceId = req.params.id;
  const userId = req.user.uid;
  const data = req.body;
  next();
};