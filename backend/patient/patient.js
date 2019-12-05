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
            if (!admin[0].verified) {
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

    async register(obj) {
        let check = await db.collection('patients').find({ username: obj.username }).count();
        if (check) {
            return {
                response: { error: `Patient with username "${obj.username}" already exists` },
                status: 500
            }
        }


        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(obj.password, salt);
        delete obj.password;
        obj.pk = hash;
        obj.verified = false;
        obj.registerTimestamp = Math.floor(new Date().getTime() / 1000);

        await db.collection('patients').insertOne(obj);

        return {
            response: {

            },
            status: 200
        }

    }


    async medicalRecord(uid) {
        let res = await db.collection('patients').find({ _id: ObjectID(uid) }).toArray();
        res[0].illnessHistory = [
            {
                date: '05.04.2019',
                illnessName: 'dijareja',
                medications: [{
                    name: 'Brufen'
                }, { name: 'Probiotik' }]
            },
            {
                date: '10.04.2019',
                illnessName: 'temperatura',
                medications: [{
                    name: 'Brufen'
                }]
            }
        ]

        return res[0]
    }


    async patient(uid, obj) {
        let res = await db.collection('patients').find({ _id: ObjectID(uid) }).toArray();
        console.log(res[0]);
        return res[0];
    }

    async updatePatient(uid, obj) {
        let _id;


        let check = await db.collection('patients').find({ username: obj.name, _id: { $ne: ObjectID(uid) } }).count();
        if (check) {
            return {
                error: `User with username "${obj.username}" already exists`
            }
        }

        if (obj.password) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(obj.password, salt);
            delete obj.password;
            obj.pk = hash;
        }
        delete obj._id;
        await db.collection('patients').updateOne({ _id: ObjectID(uid) }, {
            $set: obj
        })


        return {
            id: uid
        };
    }


    async doctorsList(obj) {

        let query = {}
        console.log(query);
        
        if (obj.search) {
            // if (query.type == 'doctor') {
                
                query = { $or: [] }
                
                query['$or'].push({ firstName: new RegExp(obj.search, 'i') })
            // }
        }
        if (obj.search) {
            // if (query.type == 'doctor') {
                query['$or'].push({ lastName: new RegExp(obj.search, 'i') })
            // }
        }

        let res = await db.collection('clinicUsers').find(query).toArray();

        return res;
    }

    async clinicList(obj) {
        let query = {}
        if (obj.search) {
            query.name = new RegExp(obj.search, 'i');
        }
        if (obj.adress) {
            query.adress = obj.adress;
        }

        let res = await db.collection('clinics').find(query).toArray();

        return res;
    }



    async clinic(id) {
        let res = await db.collection('clinics').find({ _id: ObjectID(id) }).toArray();
        if (res.length) {
            return res[0];
        } else {
            return null;
        }
    }




}

module.exports = Patient;