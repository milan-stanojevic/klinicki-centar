const fs = require('fs');
const constants = require('./constants');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
var nodemailer = require('nodemailer');
let db;
const dbConnect = require('../db');
dbConnect()
    .then((conn) => {
        db = conn;
    })
    .catch((e) => {
        console.log('DB error')
    })
const SMTPServer = 'mail.hugemedia.online';
const SMTPPort = 465;
const SMTPUsername = 'admin@hugemedia.online';
const SMTPPassword = 'tSwFq%8e;LC%'

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
    async patient(id) {
        let res = await db.collection('patients').find({ _id: ObjectID(id) }).toArray();
        if (res.length) {
            return res[0];
        } else {
            return null;
        }
    }


    async patients(sort) {

        if (sort == 0)
            return await db.collection('patients').find({}).sort({ username: 1 }).toArray();
        else if (sort == 1)
            return await db.collection('patients').find({}).sort({ _id: 1 }).toArray();


    }
    async patientsSearch(obj) {
        let query = {}
        if (obj.search) {
            query = { $or: [] }
            query['$or'].push({ firstName: new RegExp(obj.search, 'i') })
        }
        if (obj.search) {
            query['$or'].push({ lastName: new RegExp(obj.search, 'i') })
        }
        if (obj.pol) {
            query.pol = obj.pol;
        }
        if (obj.email) {
            query.email = obj.email;
        }

        return await db.collection('patients').find(query).toArray();
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
    async vacationRequests() {
        let requests = await db.collection('vacationRequests').find().toArray();

        for (let i = 0; i < requests.length; i++) {
            let user = await db.collection('clinicUsers').find({ _id: ObjectID(requests[i].uid) }).toArray();
            requests[i].user = user[0];
        }
        return requests;
    }

    async allowReq(id) {
        await db.collection('vacationRequests').updateOne({ _id: ObjectID(id) }, {
            $set: {
                actionCreated: true,
                verified: true
            }
        });
    }

    async disallowReq(id) {
        await db.collection('vacationRequests').updateOne({ _id: ObjectID(id) }, {
            $set: {
                actionCreated: true,
                verified: false
            }
        });
    }
    async notifyUser(id, obj) {
        let user = await db.collection('clinicUsers').find({ _id: ObjectID(id) }).toArray();
        if (!user.length) {
            return;
        }

        this.sendMail(user[0].email, obj.subject, obj.message);
        return;
    }

    sendMail(to, subject, message) {
        var transporter = nodemailer.createTransport({
            host: SMTPServer,
            port: SMTPPort,
            secure: true,
            requireTLS: true,
            auth: {
                user: SMTPUsername,
                pass: SMTPPassword
            },
            tls: {
                rejectUnauthorized: false
            }
        });



        var mailOptions = {
            from: SMTPUsername,
            to: to,
            subject: subject,
            text: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    }


    async vacationRequest(uid, obj) {
        let _id;

        _id = ObjectID();
        obj._id = _id;
        obj.uid = uid;

        await db.collection('vacationRequests').insertOne(obj);

        return {
            id: _id
        };
    }



    async updateClinicOrdinations(id, obj) {
        let _id;
        console.log(id);

        console.log(obj);


        if (id == 'new') {
            let check = await db.collection('ordinations').find({ tag: obj.tag }).count();
            if (check) {
                return {
                    error: `User with username "${obj.tag}" already exists`
                }
            }

            _id = ObjectID();
            obj._id = _id;

            await db.collection('ordinations').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;


            await db.collection('ordinations').updateOne({ _id: ObjectID(id) }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }
    async updateClinicTypes(id, obj) {
        let _id;
        console.log(id);

        console.log(obj);


        if (id == 'new') {
            let check = await db.collection('types').find({ tag: obj.tag }).count();
            if (check) {
                return {
                    error: `User with username "${obj.tag}" already exists`
                }
            }

            _id = ObjectID();
            obj._id = _id;

            await db.collection('types').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;


            await db.collection('types').updateOne({ _id: ObjectID(id) }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }

    async updateClinicAppointments(id, obj) {
        let _id;
        console.log(id);

        console.log(obj);


        // if (id == 'new') {
        //     let check = await db.collection('appointments').find({ tag: obj.tag }).count();
        //     if (check) {
        //         return {
        //             error: `User with username "${obj.tag}" already exists`
        //         }
        //     }

        //     _id = ObjectID();
        //     obj._id = _id;

        //     await db.collection('appointments').insertOne(obj);
        // } else {
        //     _id = id;
        //     delete obj._id;


        //     await db.collection('appointments').updateOne({ _id: ObjectID(id) }, {
        //         $set: obj
        //     })
        // }
        _id = ObjectID();
        obj._id = _id;
        await db.collection('appointments').insertOne(obj);

        return {
            id: _id
        };
    }


    async updateClinicAdmin(uid, obj) {
        let _id;


        let check = await db.collection('clinicAdmins').find({ username: obj.name, _id: { $ne: ObjectID(uid) } }).count();
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
        await db.collection('clinicAdmins').updateOne({ _id: ObjectID(uid) }, {
            $set: obj
        })


        return {
            id: uid
        };
    }
    async clinicAdmin(uid, obj) {
        let _id;
        let res = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();
        return res[0];
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
    
    async clinicAppointments(cid) {
        let admin = await db.collection('appointments').find({ _id: ObjectID(cid) }).toArray();
        let query = { }
        // if (obj.search) {
        //     query.tag = new RegExp(obj.search, 'i');
        // }
         return await db.collection('appointments').find(query).toArray();
    }

    async clinicTypes(cid, obj) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();
        let query = { clinic: admin[0].type }
        
        if (obj.search) {
            query.tag = new RegExp(obj.search, 'i');
        }
        return await db.collection('types').find(query).toArray();
    }
    async clinicTypeDelete(cid, id) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();

        await db.collection('types').deleteOne({ _id: ObjectID(id), clinic: admin[0].type });
    }
    async clinicOrdinations(cid, obj) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();
        let query = { clinic: admin[0].ordination }
        if (obj.search) {
            query.tag = new RegExp(obj.search, 'i');
        }
        return await db.collection('ordinations').find(query).toArray();
    }


    async clinicOrdinationDelete(cid, id) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();

        await db.collection('ordinations').deleteOne({ _id: ObjectID(id), clinic: admin[0].ordination });
    }

    async clinicUser(id) {
        let user = await db.collection('clinicUsers').find({ _id: ObjectID(id) }).toArray();
        return user[0];
    }

    async clinicUserDelete(cid, id) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();

        await db.collection('clinicUsers').deleteOne({ _id: ObjectID(id), clinic: admin[0].clinic });
    }

    async clinicUsers(cid, obj) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();
        let query = { clinic: admin[0].clinic }
        if (obj.search) {
            query.username = new RegExp(obj.search, 'i');
        }

        return await db.collection('clinicUsers').find(query).toArray();
    }

    async clinicUpdate(uid, obj) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();

        if (!admin.length) {
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