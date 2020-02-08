const fs = require('fs');
const constants = require('./constants');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

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

    async clinicRating(uid) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();
        //console.log(id);
        let id = admin[0].clinic;
        console.log(id);
        return await db.collection('clinics').find({ _id: ObjectID(id) }).toArray();
    }
    async clinicIncome(uid) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();
        //console.log(id);
        let clinic_id = admin[0].clinic;
        let appointments = await db.collection('appointments').find({ clinic: clinic_id }).toArray();
        let income = 0;
        for (let i = 0; i < appointments.length; i++) {
            income += Number(appointments[i].price);
        }
        // console.log(income);
        // console.log(String(income));


        return String(income);
    }
    async completedEvents(uid) {

        let requests = await db.collection('appointmentRequests').find({ examinationDone: true }).toArray();

        for (let i = 0; i < requests.length; i++) {
            let appointment = await db.collection('appointments').find({ _id: ObjectID(requests[i].appointment) }).toArray();
            let patient = await db.collection('patients').find({ _id: ObjectID(requests[i].patient) }).toArray();
            requests[i].patient = patient[0] ? patient[0] : {};
            requests[i].appointment = appointment[0];
        }
        for (let i = 0; i < requests.length; i++) {

            if (requests[i].appointment.doctor) {
                let doc = await db.collection('clinicUsers').find({ _id: ObjectID(requests[i].appointment.doctor) }).toArray();
                requests[i].docName = doc[0].firstName + ' ' + doc[0].lastName;
            }

            if (requests[i].appointment.ordination) {
                let ord = await db.collection('ordinations').find({ _id: ObjectID(requests[i].appointment.ordination) }).toArray();
                requests[i].ordinationTag = ord[0].tag;
            }

            let type = await db.collection('types').find({ _id: ObjectID(requests[i].appointment.type) }).toArray();
            requests[i].typeTag = type[0].tag;

        }
        return requests;
    }

    async clinicDoctors(uid) {
        let doc = await db.collection('clinicUsers').find({ _id: ObjectID(uid) }).toArray();
        let query = { $and: [{ clinic: doc[0].clinic }, { type: "doctor" }] };
        return await db.collection('clinicUsers').find(query).toArray();
    }
    async clinicDoctorss(uid) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();
        let query = { $and: [{ clinic: admin[0].clinic }, { type: "doctor" }] };
        return await db.collection('clinicUsers').find(query).toArray();
    }

    async clinicType(uid) {
        let doc = await db.collection('clinicUsers').find({ _id: ObjectID(uid) }).toArray();
        let query = { clinic: doc[0].clinic };
        return await db.collection('types').find(query).toArray();
    }
    async clinicTypee(uid) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();
        let query = { clinic: admin[0].clinic };
        return await db.collection('types').find(query).toArray();
    }

    async clinicOrdination() {
        return await db.collection('ordinations').find({}).toArray();
    }
    async clinicOrdinationn(uid) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();
        let query = { clinic: admin[0].clinic };
        return await db.collection('ordinations').find(query).toArray();
    }
    async checkPasswordChangeCA(id) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(id) }).toArray();
        if (admin[0].changePasswordRequired) {
            return {
                required: true
            }
        } else {
            return {
                required: false
            }
        }
    }
    async checkPasswordChangeDoc(id) {
        let admin = await db.collection('clinicUsers').find({ _id: ObjectID(id) }).toArray();
        if (admin[0].changePasswordRequired) {
            return {
                required: true
            }
        } else {
            return {
                required: false
            }
        }
    }

    async clinicAdminChangePassword(id, obj) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(obj.password, salt);

        await db.collection('clinicAdmins').updateOne({ _id: ObjectID(id) }, {
            $set: {
                pk: hash,
                changePasswordRequired: false
            }
        })

        return {

        }
    }
    async doctorChangePassword(id, obj) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(obj.password, salt);

        await db.collection('clinicUsers').updateOne({ _id: ObjectID(id) }, {
            $set: {
                pk: hash,
                changePasswordRequired: false
            }
        })

        return {

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
            obj.changePasswordRequired = true;
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

    async reserveRoom(id, obj) {

        let appointment = await db.collection('appointments').find({ _id: ObjectID(id) }).toArray();


        await db.collection('appointments').updateOne({ _id: ObjectID(id) }, {
            $set: {
                ordination: obj.ordination._id,
                date: obj.start
            }
        });

        if (obj.start != appointment[0].date) {
            //this.sendMail(user[0].email, obj.subject, obj.message);
        }

        return { error: null }
    }

    async setDoctors(id, obj) {



        await db.collection('appointments').updateOne({ _id: ObjectID(id) }, {
            $set: {
                doctors: obj,
            }
        });


        return { error: null }
    }


    async appointmentRequests(uid) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();

        if (!admin.length) {
            return null;
        }

        let ordinations = await db.collection('ordinations').find({ clinic: admin[0].clinic }).toArray();


        let requests = await db.collection('appointmentRequests').find().toArray();


        let newReq = [];
        for (let i = 0; i < requests.length; i++) {
            let appointment = await db.collection('appointments').find({ _id: ObjectID(requests[i].appointment), clinic: admin[0].clinic }).toArray();
            if (appointment.length) {
                let patient = await db.collection('patients').find({ _id: ObjectID(requests[i].patient) }).toArray();
                requests[i].patient = patient[0];
                requests[i].appointment = appointment[0];
                requests[i].availDoctors = await db.collection('clinicUsers').find({ clinic: admin[0].clinic, type: 'doctor' }).toArray();
                newReq.push(requests[i]);
            }

        }

        requests = newReq;

        for (let i = 0; i < requests.length; i++) {
            if (requests[i].appointment.doctor) {
                let doc = await db.collection('clinicUsers').find({ _id: ObjectID(requests[i].appointment.doctor) }).toArray();
                requests[i].docName = doc[0].firstName + ' ' + doc[0].lastName;
            }
            if (requests[i].appointment.ordination) {
                let ord = await db.collection('ordinations').find({ _id: ObjectID(requests[i].appointment.ordination) }).toArray();
                requests[i].ordinationTag = ord[0].tag;
            }

            let type = await db.collection('types').find({ _id: ObjectID(requests[i].appointment.type) }).toArray();
            requests[i].typeTag = type[0].tag;

        }



        for (let i = 0; i < requests.length; i++) {

            let start = Math.floor(moment(requests[i].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
            let duration = requests[i].appointment.duration * 60;


            if (!requests[i].appointment.ordination) {
                requests[i].freeOrdinations = [];
                let ordinationsMap = {}

                for (let j = 0; j < ordinations.length; j++) {
                    let ordinationBusy = false;

                    for (let k = 0; k < requests.length; k++) {
                        if (i == k) {
                            continue;
                        }

                        if (requests[k].appointment.ordination == ordinations[j]._id.toString()) {
                            let s = Math.floor(moment(requests[k].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                            let d = requests[k].appointment.duration * 60;

                            if ((start >= s && start <= s + d) || (start + duration >= s && start + duration <= s + d)) {
                                ordinationBusy = true;
                                break;
                            }

                        }

                        if (ordinationBusy == true) {
                            break;
                        }


                    }
                    if (!ordinationBusy) {
                        ordinationsMap[ordinations[j].tag] = { ordination: ordinations[j], start: requests[i].appointment.date };
                    } else {
                        ordinationBusy = false;
                        while (1) {
                            start += 6000;
                            for (let k = 0; k < requests.length; k++) {
                                if (i == k) {
                                    continue;
                                }

                                if (requests[k].appointment.ordination == ordinations[j]._id.toString()) {
                                    let s = Math.floor(moment(requests[k].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                                    let d = requests[k].appointment.duration * 60;

                                    if ((start >= s && start <= s + d) || (start + duration >= s && start + duration <= s + d)) {
                                        ordinationBusy = true;
                                        break;
                                    }

                                }

                                if (ordinationBusy == true) {
                                    break;
                                }


                            }

                            if (ordinationBusy == false) {
                                ordinationsMap[ordinations[j].tag] = { ordination: ordinations[j], start: moment.unix(start).format('DD.MM.YYYY, HH:mm') };
                                console.log("start");
                                break;
                            }

                        }
                    }
                }

                requests[i].freeOrdinations = Object.values(ordinationsMap)


            }
        }

        return requests;
    }



    async allAppointmentRequests() {

        let clinics = await db.collection('clinics').find({}).toArray();

        for (let c = 0; c < clinics.length; c++) {
            let ordinations = await db.collection('ordinations').find({ clinic: clinics[c]._id.toString() }).toArray();


            let requests = await db.collection('appointmentRequests').find().toArray();



            for (let i = 0; i < requests.length; i++) {
                let appointment = await db.collection('appointments').find({ _id: ObjectID(requests[i].appointment) }).toArray();
                let patient = await db.collection('patients').find({ _id: ObjectID(requests[i].patient) }).toArray();
                requests[i].patient = patient[0];
                requests[i].appointment = appointment[0];

            }


            for (let i = 0; i < requests.length; i++) {

                let start = Math.floor(moment(requests[i].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                let duration = requests[i].appointment.duration * 60;


                if (!requests[i].appointment.ordination) {
                    requests[i].freeOrdinations = [];
                    let ordinationsMap = {}

                    for (let j = 0; j < ordinations.length; j++) {
                        let ordinationBusy = false;

                        for (let k = 0; k < requests.length; k++) {
                            if (i == k) {
                                continue;
                            }

                            if (requests[k].appointment.ordination == ordinations[j].tag) {
                                let s = Math.floor(moment(requests[k].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                                let d = requests[k].appointment.duration * 60;

                                if ((start >= s && start <= s + d) || (start + duration >= s && start + duration <= s + d)) {
                                    ordinationBusy = true;
                                    break;
                                }

                            }

                            if (ordinationBusy == true) {
                                break;
                            }


                        }
                        if (!ordinationBusy) {
                            ordinationsMap[ordinations[j].tag] = { ordination: ordinations[j], start: requests[i].appointment.date };
                        } else {
                            ordinationBusy = false;
                            while (1) {
                                start += 6000;
                                for (let k = 0; k < requests.length; k++) {
                                    if (i == k) {
                                        continue;
                                    }

                                    if (requests[k].appointment.ordination == ordinations[j].tag) {
                                        let s = Math.floor(moment(requests[k].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                                        let d = requests[k].appointment.duration * 60;

                                        if ((start >= s && start <= s + d) || (start + duration >= s && start + duration <= s + d)) {
                                            ordinationBusy = true;
                                            break;
                                        }

                                    }

                                    if (ordinationBusy == true) {
                                        break;
                                    }


                                }

                                if (ordinationBusy == false) {
                                    ordinationsMap[ordinations[j].tag] = { ordination: ordinations[j], start: moment.unix(start).format('DD.MM.YYYY, HH:mm') };
                                    console.log("start");
                                    break;
                                }

                            }
                        }
                    }

                    requests[i].freeOrdinations = Object.values(ordinationsMap)


                }
            }
            clinics[c].requests = requests;
        }
        return clinics;
    }


    async allowReqAppointment(id) {
        let request = await db.collection('appointmentRequests').find({ _id: ObjectID(id) }).toArray();
        let appointment = request[0].appointment;
        let app = await db.collection('appointments').find({ _id: appointment }).toArray();


        await db.collection('appointmentRequests').updateOne({ _id: ObjectID(id) }, {
            $set: {
                verified: true
            }
        });
        await db.collection('appointments').updateOne({ _id: appointment }, {
            $set: {
                verified: true,
                actionCreated: false

            }
        });
        await db.collection('ordinations').updateOne({ _id: ObjectID(app[0].ordination) }, {
            $set: {
                reserved: true

            }
        });
        await db.collection('types').updateOne({ _id: ObjectID(app[0].type) }, {
            $set: {
                reserved: true

            }
        });
        await db.collection('clinicUsers').updateOne({ _id: ObjectID(app[0].doctor) }, {
            $set: {
                reserved: true

            }
        });
    }

    async disallowReqAppointment(id) {
        let request = await db.collection('appointmentRequests').find({ _id: ObjectID(id) }).toArray();
        let appointment = request[0].appointment;
        let app = await db.collection('appointments').find({ _id: appointment }).toArray();

        await db.collection('appointmentRequests').updateOne({ _id: ObjectID(id) }, {
            $set: {
                verified: false
            }
        });
        await db.collection('appointments').updateOne({ _id: appointment }, {
            $set: {
                verified: false,
                actionCreated: false
            }
        });
        await db.collection('ordinations').updateOne({ _id: ObjectID(app[0].ordination) }, {
            $set: {
                reserved: false

            }
        });
        await db.collection('types').updateOne({ _id: ObjectID(app[0].type) }, {
            $set: {
                reserved: false

            }
        });
        await db.collection('clinicUsers').updateOne({ _id: ObjectID(app[0].doctor) }, {
            $set: {
                reserved: false

            }
        });
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
    async notifyPatient(id, obj) {
        let user = await db.collection('patients').find({ _id: ObjectID(id) }).toArray();
        if (!user.length) {
            return;
        }

        this.sendMail(user[0].email, obj.subject, obj.message);
        return;
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

    async clinicOrd(uid, userId) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();

        if (!admin.length) {
            return null;
        }

        let res = await db.collection('ordinations').find({ clinic: admin[0].clinic, _id: ObjectID(userId) }).toArray();
        if (res.length) {
            return res[0];
        } else {
            return null;
        }
    }
    async clinictype(uid, userId) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();

        if (!admin.length) {
            return null;
        }

        let res = await db.collection('types').find({ clinic: admin[0].clinic, _id: ObjectID(userId) }).toArray();
        if (res.length) {
            return res[0];
        } else {
            return null;
        }
    }


    async updateClinicOrdinations(uid, id, obj) {
        let _id;
        console.log(id);

        console.log(obj);
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();
        let cid = admin[0].clinic;


        if (id == 'new') {
            let check = await db.collection('ordinations').find({ tag: obj.tag }).count();
            if (check) {
                return {
                    error: `Ordination with tag "${obj.tag}" already exists`
                }
            }

            _id = ObjectID();
            obj._id = _id;
            obj.clinic = cid;

            await db.collection('ordinations').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;

            let check = await db.collection('ordinations').find({ tag: obj.tag, _id: { $ne: ObjectID(id) }, clinic: cid }).count();
            if (check) {
                return {
                    error: `Ordination with tag "${obj.tag}" already exists`
                }
            }

            await db.collection('ordinations').updateOne({ _id: ObjectID(id), clinic: cid }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }
    async updateClinicTypes(uid, id, obj) {
        let _id;
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();
        let cid = admin[0].clinic;

        if (id == 'new') {
            let check = await db.collection('types').find({ tag: obj.tag }).count();
            if (check) {
                return {
                    error: `Type with tag "${obj.tag}" already exists`
                }
            }

            _id = ObjectID();
            obj._id = _id;
            obj.clinic = cid;

            await db.collection('types').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;

            let check = await db.collection('types').find({ tag: obj.tag, _id: { $ne: ObjectID(id) }, clinic: cid }).count();
            if (check) {
                return {
                    error: `type with tag "${obj.tag}" already exists`
                }
            }
            await db.collection('types').updateOne({ _id: ObjectID(id), clinic: cid }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }


    async updateClinicAppointments(uid, id, obj) {
        let _id;

        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();

        let cid = admin[0].clinic;
        if (id == 'new') {

            _id = ObjectID();
            obj._id = _id;
            obj.clinic = cid;
            obj.predef = true;

            await db.collection('appointments').insertOne(obj);
        }
        return {
            id: _id
        };
    }

    async makeNewAppointments(uid, id, obj) {
        let _id;

        let admin = await db.collection('clinicUsers').find({ _id: ObjectID(uid) }).toArray();

        let cid = admin[0].clinic;
        _id = ObjectID();
        obj._id = _id;
        obj.clinic = cid;
        obj.actionCreated = false;
        obj.verified = false;
        await db.collection('appointments').insertOne(obj);
        let appointment_id = _id;
        _id = ObjectID();
        let ob = {}
        ob._id = _id;
        ob.patient = ObjectID(id);
        ob.appointment = appointment_id;

        await db.collection('appointmentRequests').insertOne(ob);
        await db.collection('appointments').updateOne({ _id: appointment_id }, {
            $set: {
                actionCreated: true

            }
        });
        for (let i = 0; i < admin.length; i++) {
            this.sendMail(admin[i].email, "Zakazivanje pregleda", "Pacijent zeli da zakaze pregled");
        }

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
        // podesavanje datuma
        if (res[0].date) {
            let dat = new Date(res[0].date.split(".").reverse().join(".")).getTime();
            res[0].date = dat;
        }
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

    async clinicAppointments(cid, obj) {
        // let admin = await db.collection('appointments').find({ _id: ObjectID(cid) }).toArray();
        // let query = {}
        // // if (obj.search) {
        // //     query.tag = new RegExp(obj.search, 'i');
        // // }
        // return await db.collection('appointments').find(query).toArray();

        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();
        let query = { clinic: admin[0].clinic }
        let res = await db.collection('appointments').find(query).toArray();
        for (let i = 0; i < res.length; i++) {

            let doc = await db.collection('clinicUsers').find({ _id: ObjectID(res[i].doctor) }).toArray();
            res[i].docName = doc[0].firstName + ' ' + doc[0].lastName;

            let ord = await db.collection('ordinations').find({ _id: ObjectID(res[i].ordination) }).toArray();
            res[i].ordinationTag = ord[0].tag;

            let type = await db.collection('types').find({ _id: ObjectID(res[i].type) }).toArray();
            res[i].typeTag = type[0].tag;

        }
        return res;
    }



    async clinicTypes(cid, obj) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();
        let query = { clinic: admin[0].clinic }

        if (obj.search) {
            query.tag = new RegExp(obj.search, 'i');
        }
        return await db.collection('types').find(query).toArray();
    }
    async clinicTypeDelete(cid, id) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();

        await db.collection('types').deleteOne({ _id: ObjectID(id), clinic: admin[0].clinic });
    }
    async clinicOrdinations(cid, obj) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();
        let query = { clinic: admin[0].clinic }
        if (obj.tag) {
            query.tag = new RegExp(obj.tag, 'i');
        }
        if (obj.name) {
            query.name = new RegExp(obj.name, 'i');
        }


        let ordinations = await db.collection('ordinations').find(query).toArray();

        if (obj.date) {

            let requests = await db.collection('appointmentRequests').find().toArray();


            let newReq = [];
            for (let i = 0; i < requests.length; i++) {
                let appointment = await db.collection('appointments').find({ _id: ObjectID(requests[i].appointment), clinic: admin[0].clinic }).toArray();
                if (appointment.length) {
                    let patient = await db.collection('patients').find({ _id: ObjectID(requests[i].patient) }).toArray();
                    requests[i].patient = patient[0];
                    requests[i].appointment = appointment[0];
                    requests[i].availDoctors = await db.collection('clinicUsers').find({ clinic: admin[0].clinic, type: 'doctor' }).toArray();
                    newReq.push(requests[i]);
                }

            }

            requests = newReq;

            for (let i = 0; i < requests.length; i++) {
                if (requests[i].appointment.doctor) {
                    let doc = await db.collection('clinicUsers').find({ _id: ObjectID(requests[i].appointment.doctor) }).toArray();
                    requests[i].docName = doc[0].firstName + ' ' + doc[0].lastName;
                }
                if (requests[i].appointment.ordination) {
                    let ord = await db.collection('ordinations').find({ _id: ObjectID(requests[i].appointment.ordination) }).toArray();
                    requests[i].ordinationTag = ord[0].tag;
                }

                let type = await db.collection('types').find({ _id: ObjectID(requests[i].appointment.type) }).toArray();
                requests[i].typeTag = type[0].tag;

            }




            let start = Math.floor(moment(obj.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
            let duration = 60;


            let freeOrdinations = [];
            let ordinationsMap = {}

            for (let j = 0; j < ordinations.length; j++) {
                let ordinationBusy = false;

                for (let k = 0; k < requests.length; k++) {
                   
                    console.log(requests[k].appointment.ordination);
                    if (requests[k].appointment.ordination == ordinations[j]._id.toString()) {
                        let s = Math.floor(moment(requests[k].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                        let d = requests[k].appointment.duration * 60;

                        if ((start >= s && start <= s + d) || (start + duration >= s && start + duration <= s + d)) {
                            ordinationBusy = true;
                            break;
                        }

                    }

                    if (ordinationBusy == true) {
                        break;
                    }


                }
                if (!ordinationBusy) {
                    ordinationsMap[ordinations[j].tag] = { ordination: ordinations[j], start: obj.date };
                } else {
                    ordinationBusy = false;
                    while (1) {
                        start += 6000;
                        for (let k = 0; k < requests.length; k++) {
                          

                            if (requests[k].appointment.ordination == ordinations[j]._id.toString()) {
                                let s = Math.floor(moment(requests[k].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                                let d = requests[k].appointment.duration * 60;

                                if ((start >= s && start <= s + d) || (start + duration >= s && start + duration <= s + d)) {
                                    ordinationBusy = true;
                                    break;
                                }

                            }

                            if (ordinationBusy == true) {
                                break;
                            }


                        }

                        if (ordinationBusy == false) {
                            ordinationsMap[ordinations[j].tag] = { ordination: ordinations[j], start: moment.unix(start).format('DD.MM.YYYY, HH:mm') };
                            console.log("start");
                            break;
                        }

                    }
                }
            }

            freeOrdinations = Object.values(ordinationsMap)






            console.log(freeOrdinations)
            let ords = [];
            for (let i = 0; i < ordinations.length; i++) {
                let ordBusy = false;
                    for (let j=0; j< freeOrdinations.length; j++) {
                        console.log(freeOrdinations[j].start, obj.date)

                        if (ordinations[i]._id == freeOrdinations[j].ordination._id && freeOrdinations[j].start != obj.date) {
                            ordBusy = true;
                        }
                    }
                

                if (!ordBusy) {
                    ords.push(ordinations[i]);
                }
            }

            ordinations = ords;
        }

        return ordinations;
    }


    async clinicOrdinationDelete(cid, id) {
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(cid) }).toArray();

        await db.collection('ordinations').deleteOne({ _id: ObjectID(id), clinic: admin[0].clinic });
    }

    async clinicUser(id) {
        let user = await db.collection('clinicUsers').find({ _id: ObjectID(id) }).toArray();

        // podesavanje datuma

        if (user[0].date) {
            let dat = new Date(user[0].date.split(".").reverse().join(".")).getTime();
            user[0].date = dat;
        }

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
            query.firstName = new RegExp(obj.search, 'i');
        }
        // if (obj.doctorLastName) {
        //     query.lastName = new RegExp(obj.doctorLastName, 'i');
        // }

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

    async clinicAppointmentRequest(id) {
        let requests = await db.collection('appointmentRequests').find({ _id: ObjectID(id) }).toArray();

        return requests[0] ? requests[0] : {};
    }

    async events(uid) {

        let doc = await db.collection('clinicUsers').find({ _id: ObjectID(uid) }).toArray();


        let requests = await db.collection('appointmentRequests').find({ examinationDone: null }).toArray();

        let newReq = [];

        for (let i = 0; i < requests.length; i++) {
            let appointment = await db.collection('appointments').find({ _id: ObjectID(requests[i].appointment), clinic: doc[0].clinic }).toArray();
            if (appointment.length) {
                let patient = await db.collection('patients').find({ _id: ObjectID(requests[i].patient) }).toArray();
                requests[i].patient = patient[0] ? patient[0] : {};
                requests[i].appointment = appointment[0];

                newReq.push(requests[i]);
            }
        }

        requests = newReq;


        for (let i = 0; i < requests.length; i++) {

            if (requests[i].appointment.doctor) {
                let doc = await db.collection('clinicUsers').find({ _id: ObjectID(requests[i].appointment.doctor) }).toArray();
                requests[i].docName = doc[0].firstName + ' ' + doc[0].lastName;
            }

            if (requests[i].appointment.ordination) {
                let ord = await db.collection('ordinations').find({ _id: ObjectID(requests[i].appointment.ordination) }).toArray();
                requests[i].ordinationTag = ord[0].tag;
            }

            let type = await db.collection('types').find({ _id: ObjectID(requests[i].appointment.type) }).toArray();
            requests[i].typeTag = type[0].tag;

        }


        return requests;
    }


    async insertMedicalRecord(uid, id, obj) {
        let check = await db.collection('appointmentRequests').find({ _id: ObjectID(id), examinationDone: true }).count();
        if (check) {
            return {
                error: 'Pregled je zavrsen'
            }
        }

        await db.collection('appointmentRequests').updateOne({ _id: ObjectID(id) }, {
            $set: {
                examinationDone: true
            }
        });


        let request = await db.collection('appointmentRequests').find({ _id: ObjectID(id) }).toArray();
        let appointment = await db.collection('appointments').find({ _id: ObjectID(request[0].appointment) }).toArray();
        await db.collection('ordinations').updateOne({ _id: ObjectID(appointment[0].ordination) }, {
            $set: {
                reserved: false
            }
        })
        await db.collection('types').updateOne({ _id: ObjectID(appointment[0].type) }, {
            $set: {
                reserved: false
            }
        })
        await db.collection('clinicUsers').updateOne({ _id: ObjectID(appointment[0].doctor) }, {
            $set: {
                reserved: false
            }
        })

        await db.collection('illnessHistory').insertOne({
            doctor: uid,
            appointmentRequest: id,
            patient: request[0].patient,
            date: appointment[0].date,
            diagnose: obj.diagnose,
            medications: obj.medications,
            report: obj.report
        })

        return { error: null }

    }

    async diagnoses() {
        let res = await db.collection('diagnoses').find({}).sort({ _id: -1 }).toArray();
        return res;
    }

    async medications() {
        let res = await db.collection('medications').find({}).sort({ _id: -1 }).toArray();
        return res;
    }



    async medicalRecord(uid, id) {
        let res = await db.collection('patients').find({ _id: ObjectID(uid) }).toArray();
        let illnessHistory = await db.collection('illnessHistory').find({ patient: ObjectID(uid) }).toArray()
        for (let i = 0; i < illnessHistory.length; i++) {
            let medications = []
            for (let j = 0; j < illnessHistory[i].medications.length; j++) {
                let medication = await db.collection('medications').find({ _id: ObjectID(illnessHistory[i].medications[j]) }).toArray();
                if (medication.length) {
                    medications.push(medication[0])
                }
            }
            let diagnose = await db.collection('diagnoses').find({ _id: ObjectID(illnessHistory[i].diagnose) }).toArray();
            illnessHistory[i].diagnose = diagnose[0];

            illnessHistory[i].medications = medications;

            if (illnessHistory[i].doctor == id) {
                illnessHistory[i].editRaport = true;
            }
            else {
                illnessHistory[i].editRaport = false;
            }
        }

        res[0].illnessHistory = illnessHistory;
        if (res[0].pol) {
            if (res[0].pol == '1')
                res[0].pol = 'Muski';
            else if (res[0].pol == '2')
                res[0].pol = 'Zenski';
        }

        /*res[0].illnessHistory = [
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
        ]*/

        return res[0]
    }


    async finishedAppointments() {
        let requests = await db.collection('appointmentRequests').find({ examinationDone: true }).toArray();
        console.log(requests)
        for (let i = 0; i < requests.length; i++) {


            let illnessHistory = await db.collection('illnessHistory').find({ appointmentRequest: requests[i]._id.toString() }).toArray()
            console.log(illnessHistory[0].doctor)
            let doctor = await db.collection('clinicUsers').find({ _id: ObjectID(illnessHistory[0].doctor) }).toArray();
            illnessHistory[0].doctor = doctor[0];
            let patient = await db.collection('patients').find({ _id: illnessHistory[0].patient }).toArray();
            illnessHistory[0].patient = patient[0];

            let medications = []
            for (let j = 0; j < illnessHistory[0].medications.length; j++) {
                let medication = await db.collection('medications').find({ _id: ObjectID(illnessHistory[0].medications[j]) }).toArray();
                if (medication.length) {
                    medications.push(medication[0])
                }
            }
            let diagnose = await db.collection('diagnoses').find({ _id: ObjectID(illnessHistory[0].diagnose) }).toArray();
            illnessHistory[0].diagnose = diagnose[0];

            illnessHistory[0].medications = medications;

            requests[i].illnessHistory = illnessHistory[0];
        }



        return requests

    }

    async recipeVerify(id) {
        await db.collection('appointmentRequests').updateOne({ _id: ObjectID(id) }, {
            $set: {
                recipeVerified: true
            }
        })

        return {
            error: null
        }
    }
    async scheduledAppointments(uid) {
        let appointments = await db.collection('appointments').find({ doctor: uid }).toArray();

        for (let i = 0; i < appointments.length; i++) {
            let req = await db.collection('appointmentRequests').find({ appointment: appointments[i]._id }).toArray();
            appointments[i].patient = req[0].patient;
            appointments[i].examinationDone = req[0].examinationDone;
            appointments[i].appReq = req[0]._id;
            let pat = await db.collection('patients').find({ _id: appointments[i].patient }).toArray();
            appointments[i].patientName = pat[0].firstName + ' ' + pat[0].lastName;
        }
        for (let i = 0; i < appointments.length; i++) {

            let doc = await db.collection('clinicUsers').find({ _id: ObjectID(appointments[i].doctor) }).toArray();
            appointments[i].docName = doc[0].firstName + ' ' + doc[0].lastName;

            let ord = await db.collection('ordinations').find({ _id: ObjectID(appointments[i].ordination) }).toArray();
            appointments[i].ordinationTag = ord[0].tag;

            let type = await db.collection('types').find({ _id: ObjectID(appointments[i].type) }).toArray();
            appointments[i].typeTag = type[0].tag;

        }



        return appointments;

    }

    async medicalRecordItem(id) {
        let illnessHistory = await db.collection('illnessHistory').find({ _id: ObjectID(id) }).toArray();

        return illnessHistory[0]
    }

    async fillMedicalRecord(id, obj) {
        let patient = await db.collection('patients').find({ _id: ObjectID(id) }).toArray();
        // console.log(obj);
        await db.collection('patients').updateOne({ _id: ObjectID(id) }, {
            $set: {
                medicalRecord: obj
            }
        });
        console.log(patient[0]);
        return await db.collection('patients').find({ _id: ObjectID(id) }).toArray();

    }


    async updateMedicalRecord(uid, id, obj) {
        let check = await db.collection('illnessHistory').find({ _id: ObjectID(id), doctor: uid }).count();
        if (!check) {
            return {
                error: 'Nije dozvoljeno'
            }
        }

        await db.collection('illnessHistory').updateOne({ _id: ObjectID(id) }, {
            $set: {
                diagnose: obj.diagnose,
                medications: obj.medications,
                report: obj.report
            }
        })

        return { error: null }

    }

}

module.exports = Clinic;