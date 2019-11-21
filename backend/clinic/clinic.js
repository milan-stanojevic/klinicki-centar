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
        db = conn;
    })
    .catch((e) => {
        console.log('DB error')
    })

class Clinic {
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

        let admin = await db.collection('clinicAdmins').find({ username: username }).toArray();

        if (!admin.length) {
            return {
                response: {
                    error: 'User not exists'
                },
                status: 404
            };

        } else {
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


    async userLogin(username, password) {
        //console.log(db);   

        let admin = await db.collection('clinicUsers').find({ username: username }).toArray();

        if (!admin.length) {
            return {
                response: {
                    error: 'User not exists'
                },
                status: 404
            };

        } else {
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


    async patients() {
        return await db.collection('patients').find({}).toArray();


    }


    async clinicData(uid) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();

        if (!admin.length) {
            return null;
        }

        let res = await db.collection('clinics').find({ _id: ObjectID(admin[0].clinic) }).toArray();
        if (res.length) {
            return res[0];
        } else {
            return null;
        }
    }

    async clinicUser(uid, userId) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();

        if (!admin.length) {
            return null;
        }

        let res = await db.collection('clinicUsers').find({ clinic: admin[0].clinic, _id: ObjectID(userId) }).toArray();
        if (res.length) {
            return res[0];
        } else {
            return null;
        }
    }


    async updateClinicUser(uid, id, obj) {
        let _id;

        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();

        let cid = admin[0].clinic;

        if (id == 'new') {
            let check = await db.collection('clinicUsers').find({ username: obj.username }).count();
            if (check) {
                return {
                    error: `User with username "${obj.username}" already exists`
                }
            }

            _id = ObjectID();
            obj._id = _id;
            obj.clinic = cid;

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(obj.password, salt);
            delete obj.password;
            obj.pk = hash;

            await db.collection('clinicUsers').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;
            obj.clinic = cid;
            let check = await db.collection('clinicUsers').find({ username: obj.name, _id: { $ne: ObjectID(id) } }).count();
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

            await db.collection('clinicUsers').updateOne({ _id: ObjectID(id), clinic: cid }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }

    async updateUserProfile(id, obj) {
        let _id;

        _id = id;
        delete obj._id;
        let check = await db.collection('clinicUsers').find({ username: obj.name, _id: { $ne: ObjectID(id) } }).count();
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

        await db.collection('clinicUsers').updateOne({ _id: ObjectID(id) }, {
            $set: obj
        })

        return {
            id: _id
        };
    }

    async clinicUser(id) {
        let user = await db.collection('clinicUsers').find({ _id: ObjectID(id) }).toArray();
        return user[0];
    }

    async clinicUserDelete(cid, id) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();

        await db.collection('clinicUsers').deleteOne({ _id: ObjectID(id), clinic: admin[0].clinic });
    }

    async clinicUsers(cid) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();


        return await db.collection('clinicUsers').find({ clinic: admin[0].clinic }).toArray();
    }

    async clinicUpdate(uid, obj) {
        let admin = await db.collection('clinicAdmins').find({_id: ObjectID(uid) }).toArray();

        if (!admin.length){
            return null;
        }



        let _id;
        _id = ObjectID(admin[0].clinic);
        delete obj._id;
        let check = await db.collection('clinics').find({ name: obj.name, _id: { $ne: ObjectID(admin[0].clinic) } }).count();
        if (check) {
            return {
                error: `Clinic with name "${obj.name}" already exists`
            }
        }

        await db.collection('clinics').updateOne({ _id: ObjectID(admin[0].clinic) }, {
            $set: obj
        })


        return {
            id: _id
        };
    }




}

module.exports = Clinic;