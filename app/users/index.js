const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
    origin:true
});

function checkUserData(data){
    return data.hasOwnProperty('first_name')
        && data.hasOwnProperty('last_name')
        && data.hasOwnProperty('email')
        && data.hasOwnProperty('password')
        && data.hasOwnProperty('phone')
        && data.hasOwnProperty('address')
        && data.hasOwnProperty('postal_code')
        && data.hasOwnProperty('country')
        && data.hasOwnProperty('city')
        && data.hasOwnProperty('date_of_birth')
        && data.hasOwnProperty('gender');
}

exports.user = functions.region('europe-west1').https.onRequest((req, res) => {
    return cors(req, res, () => {
        const dbref = admin.database().ref();
        const data = req.body;

        let user_id = '';
        if (req.query.hasOwnProperty('id')) {
            user_id = req.query.id
        } else {
            user_id = req.body.id
        }

        if (req.method === 'POST') {
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                return res.status(204).json({
                    message: 'No content in body.'
                })
            }
            const data = req.body;
            if (!checkUserData(data)) {
                return res.status(403).json({
                    message: 'Denied. Missing parameters. Required: first_name, last_name, email, ' +
                        'password, phone, address, postal_code, city, country, date_of_birth, gender'
                })
            }
            admin.auth().createUser({
                email: data.email,
                emailVerified: false,
                password: data.password,
                disabled: false
            })
            .then((userRecord) => {
                console.log(`User created with UID of: ${userRecord.uid}`);
                dbref.child('Users').child(userRecord.uid.toString()).set({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    postal_code: data.postal_code,
                    city: data.city,
                    country: data.country,
                    date_of_birth: data.date_of_birth,
                    gender: data.gender
                }).then(() => {
                    return res.status(200).json({
                        message: 'User Created Successfully',
                        email: userRecord.email,
                        user_uid: userRecord.uid,
                    });
                })
            })
            .catch((error) => {
                console.log(`Error creating user: ${error}`);
                return res.status(500).json({
                    message: 'Error' + error.toString()
                })
            })
        }
        else if (req.method === 'PUT') {

            let user = dbref.child('Users');
            user.once('value').then((snapshot) => {
                if(!snapshot.child(user_id).exists()) {
                    return res.status(404).json({
                        message: 'User with specified UID does not exist.'
                    })
                }
            });
            if (data.constructor === Object && Object.keys(req.body).length === 0) {
                return res.status(204).json({
                    message: 'No content. UID required as a URL parameter or as part of request body. ' +
                        '\n Changeable values include: first_name, last_name, phone, address, postal_code, ' +
                        'city, country, date_of_birth, gender'
                })
            }
            if (user_id === '') {
                return res.status(400).json({
                    message: 'Denied. Uid must be present either as a URL parameter or as part of the request body.'
                })
            }
            if (data.updated_type ===  'email') {
                return res.status(403).json({
                    message: 'Denied. Email must be changed through change email functionality'
                })
            }
            dbref.child('Users').child(user_id).update({
                [data.updated_type] : data.value.toString()
            })
            .then(() => {
                res.status(200).json({
                    message: "Update successful"
                })
            })
            .catch((error) => {
                res.json({
                    message: "error" + error.toString()
                })
            })
        }
        else if (req.method === 'GET') {
            let user = dbref.child('Users');
            user.once('value').then((snapshot) => {
                if(!snapshot.child(user_id).exists()) {
                    return res.status(404).json({
                        message: 'User with specified UID does not exist.'
                    })
                }
            });
            if (user_id === '') {
                return res.status(400).json({
                    message: 'Denied. Uid must be present either as a URL parameter or as part of the request body.'
                })
            }
            user.on('value', function (snapshot) {
                return res.status(200).json(
                    snapshot.child(user_id).val()
                );
            })
        }
    })
});

