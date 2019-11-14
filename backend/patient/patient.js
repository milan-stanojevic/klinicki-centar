const fs = require('fs');
const constants = require('./constants');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
let db;
const dbConnect = require('../db');
dbConnect()
.then((conn) => {
    // your connection object
    db = conn;
})
.catch((e) => {
    // handle err
})

class Patient {
    constructor(props) {

    }

    upload(base64) {
        let fname = uuidv4();
        let extension = base64.split(';')[0].replace('data:image/', '.').replace('data:audio/', '.');

        if (extension.indexOf('svg') != -1) {
            extension = '.svg';
        }

        let base64Image = base64.split(';base64,').pop();
        let filename = fname + extension;

        fs.writeFileSync('./uploads/' + filename, base64Image, { encoding: 'base64' });
        return 'http://127.0.0.1:4000/uploads/' + filename;
    }


    async login(username, password) {
        //console.log(db);   

        let admin = await db.collection('patients').find({ username: username }).toArray();

        if (!admin.length) {
            return {
                response: {
                    error: 'User not exists'
                },
                status: 404
            };

        } else {
            if (!admin[0].verified){
                return {
                    response: {
                        error: 'Patient registration not verified'
                    },
                    status: 500
                };    
            }

            if (bcrypt.compareSync(password, admin[0].pk)) {
                let token = jwt.sign({ "id": admin[0]._id }, constants.jwtSecretKey, { algorithm: 'HS256' });
                return {
                    response: {
                        token: token
                    },
                    status: 200
                };

            } else {
                return {
                    response: {
                        error: 'Wrong creditials'
                    },
                    status: 400
                };

            }
        }
    }

    async register(obj){
        let check = await db.collection('patients').find({username: obj.username}).count();
        if (check){
            return {
                response: {error: `Patient with username "${obj.username}" already exists`},
                status: 500
            }
        }
        
        
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(obj.password, salt);
        delete obj.password;
        obj.pk = hash;
        obj.verified = false;

        await db.collection('patients').insertOne(obj);

        return {
            response: {

            },
            status: 200
        }

    }

    async clinicList(){
        let res = await db.collection('clinics').find({}).sort({_id: -1}).toArray();
        return res;
    }

    async clinic(id){
        let res = await db.collection('clinics').find({_id: ObjectID(id)}).toArray();
        if (res.length){
            return res[0];
        }else{
            return null;
        }
    }


}

module.exports = Patient;