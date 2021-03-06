const fs = require('fs');
const constants = require('./constants');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
var nodemailer = require('nodemailer');
const moment = require('moment');
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


const SMTPServer = Buffer.from('bWFpbC5odWdlbWVkaWEub25saW5l', 'base64').toString('ascii');
const SMTPPort = 465;
const SMTPUsername = Buffer.from('YWRtaW5AaHVnZW1lZGlhLm9ubGluZQ==', 'base64').toString('ascii');
const SMTPPassword = 'tSwFq%8e;LC%'

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

        obj._id = ObjectID();

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(obj.password, salt);
        delete obj.password;
        obj.pk = hash;
        obj.verified = false;
        obj.registerTimestamp = Math.floor(new Date().getTime() / 1000);
        obj.uniqueID = await db.collection("patients").find({}).count();

        await db.collection('patients').insertOne(obj);

        return {
            response: {
                id: obj._id
            },
            status: 200
        }

    }


    async clinicGrading(uid) {
        let query = { $and: [{ patient: ObjectID(uid) }, { verified: true }] };
        let appointmentRequests = await db.collection('appointmentRequests').find(query).toArray();
        let appointments = [];
        for (let i = 0; i < appointmentRequests.length; i++) {
            let req = await db.collection('appointments').find({ _id: appointmentRequests[i].appointment }).toArray();
            appointments.push(req[0]);
        }
        let res = [];
        for (let i = 0; i < appointments.length; i++) {
            let app = await db.collection('clinics').find({ _id: ObjectID(appointments[i].clinic) }).toArray();
            res.push(app[0]);
        }
        // console.log(res);
        let result = [];
        let clinics = await db.collection('clinics').find().toArray();
        for (let i = 0; i < clinics.length; i++) {
            for (let j = 0; j < res.length; j++) {
                if (JSON.stringify(clinics[i]) === JSON.stringify(res[j])) {
                    result.push(clinics[i]);
                    break;
                }
            }
        }


        // console.log(result);
        return result;
        // return await db.collection('clinics').find({}).toArray();
    }
    async doctorGrading(uid) {
        let query = { $and: [{ patient: ObjectID(uid) }, { verified: true }] }
        let appointmentRequests = await db.collection('appointmentRequests').find(query).toArray();
        let appointments = [];
        for (let i = 0; i < appointmentRequests.length; i++) {
            let req = await db.collection('appointments').find({ _id: appointmentRequests[i].appointment }).toArray();
            appointments.push(req[0]);
        }

        let res = [];
        for (let i = 0; i < appointments.length; i++) {
            let app = await db.collection('clinicUsers').find({ _id: ObjectID(appointments[i].doctor) }).toArray();
            res.push(app[0]);
        }


        let result = [];
        let doctor = await db.collection('clinicUsers').find().toArray();
        for (let i = 0; i < doctor.length; i++) {
            for (let j = 0; j < res.length; j++) {
                if (JSON.stringify(doctor[i]) === JSON.stringify(res[j])) {
                    result.push(doctor[i]);
                    break;
                }
            }
        }


        //console.log(result);
        // return await db.collection('clinicUsers').find({ type: 'doctor' }).toArray();
        return result;
    }

    async clinicRating(obj) {
        // console.log(obj);
        let cl = await db.collection('clinics').find({ _id: ObjectID(obj.clinic) }).toArray();
        if (cl[0].rating == null) {
            cl[0].rating = '0';
            cl[0].numberOfRating = '0';
            cl[0].avgRating = '0';
        }
        let inc_rating = Number(cl[0].rating) + Number(obj.ratingClinic);
        let inc_num = Number(cl[0].numberOfRating) + 1;
        let avg = parseFloat(Number(inc_rating / inc_num)).toFixed(2);


        await db.collection('clinics').updateOne({ _id: ObjectID(obj.clinic) }, {
            $set: {
                rating: String(inc_rating),
                numberOfRating: String(inc_num),
                avgRating: String(avg),
            }
        });


        return await db.collection('clinics').find().toArray();
    }
    async doctorRating(obj) {
        let cl = await db.collection('clinicUsers').find({ _id: ObjectID(obj.doctor) }).toArray();
        if (cl[0].rating == null) {
            cl[0].rating = '0';
            cl[0].numberOfRating = '0';
            cl[0].avgRating = '0';
        }
        let inc_rating = Number(cl[0].rating) + Number(obj.ratingDoctor);
        let inc_num = Number(cl[0].numberOfRating) + 1;
        let avg = parseFloat(Number(inc_rating / inc_num)).toFixed(2);
        await db.collection('clinicUsers').updateOne({ _id: ObjectID(obj.doctor) }, {
            $set: {
                rating: String(inc_rating),
                numberOfRating: String(inc_num),
                avgRating: String(avg),

            }
        });


        return await db.collection('clinicUsers').find().toArray();
    }



    async medicalRecord(uid) {
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


    async patient(uid, obj) {
        let res = await db.collection('patients').find({ _id: ObjectID(uid) }).toArray();
        // podesavanje datuma

        if (res[0].date) {
            let dat = new Date(res[0].date.split(".").reverse().join(".")).getTime();
            res[0].date = dat;
        }

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
    async illnessHistory(uid, sort) {
        let res = await db.collection('illnessHistory').find({ patient: ObjectID(uid) }).toArray();

        for (let j = 0; j < res.length; j++) {
            let doc = await db.collection('clinicUsers').find({ _id: ObjectID(res[j].doctor) }).toArray();
            res[j].doctor = doc[0].firstName + " " + doc[0].lastName;

            let dig = await db.collection('diagnoses').find({ _id: ObjectID(res[j].diagnose) }).toArray();
            res[j].diagnose = dig[0].name;

            for (let i = 0; i < res[j].medications.length; i++) {
                let med = await db.collection('medications').find({ _id: ObjectID(res[j].medications[i]) }).toArray();
                res[j].medications[i] = med[0].name;
            }
        }


        if (sort == 1) {
            res = res.sort((a, b) => {
                var textA = a.doctor.toUpperCase();
                var textB = b.doctor.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
        }
        else if (sort == 2) {
            res = res.sort((a, b) => {
                var textA = a.diagnose.toUpperCase();
                var textB = b.diagnose.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
        }
        else if (sort == 3) {
            res = res.sort((a, b) => {
                var textA = a.date;
                let dateTimeParts = textA.split(',');
                let timeParts = dateTimeParts[1].split(':');
                let dateParts = dateTimeParts[0].split('.');
                let date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
                textA = date.getTime();

                var textB = b.date;
                let dateTimeParts1 = textB.split(',');
                let timeParts1 = dateTimeParts1[1].split(':');
                let dateParts1 = dateTimeParts1[0].split('.');
                let date1 = new Date(dateParts1[2], parseInt(dateParts1[1], 10) - 1, dateParts1[0], timeParts1[0], timeParts1[1]);
                textB = date1.getTime();

                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
        }

        return res;
    }
    async rateAllowed(uid) {
        let app = await db.collection('appointmentRequests').find({ $and: [{ patient: ObjectID(uid) }, { verified: true }] }).toArray();
        let empty = [];
        if (JSON.stringify(app) === JSON.stringify(empty)) {
            return false;
        }
        else {
            return true;
        }
    }


    async doctorsList(obj, id) {

        let query = { clinic: id }

        if (obj.doctorName) {
            query.firstName = new RegExp(obj.doctorName, 'i');
        }
        if (obj.doctorLastName) {
            query.lastName = new RegExp(obj.doctorLastName, 'i');
        }
        if (obj.doctorRating) {
            query.avgRating = new RegExp(obj.doctorRating, 'i');
        }





        let res = await db.collection('clinicUsers').find(query).toArray();

        return res;
    }
    async appointementsList(id) {

        let query = { clinic: id }

        let res = await db.collection('appointments').find(query).toArray();

        for (let i = 0; i < res.length; i++) {

            let doc = await db.collection('clinicUsers').find({ _id: ObjectID(res[i].doctor) }).toArray();
            res[i].docName = doc[0].firstName + ' ' + doc[0].lastName;

            let ord = await db.collection('ordinations').find({ _id: ObjectID(res[i].ordination) }).toArray();
            if (ord.length) {
                res[i].ordinationTag = ord[0].tag;
            }
            let type = await db.collection('types').find({ _id: ObjectID(res[i].type) }).toArray();
            res[i].typeTag = type[0].tag;

        }

        return res;
    }

    async clinicType() {
        return await db.collection('types').find({}).toArray();
    }
    async clinicList(obj, sort) {
        let query = {}
        if (obj.search) {
            query.name = new RegExp(obj.search, 'i');
        }
        if (obj.adress) {
            query.adress = new RegExp(obj.adress, 'i');
        }


        if (sort == 0)
            return await db.collection('clinics').find(query).sort({ name: 1 }).toArray();
        else if (sort == 1)
            return await db.collection('clinics').find(query).sort({ adress: 1 }).toArray();
        else if (sort == 2)
            return await db.collection('clinics').find(query).sort({ avgRating: -1 }).toArray();

        // let res = await db.collection('clinics').find(query).toArray();

        // return res;
    }




    async clinic(id) {
        let res = await db.collection('clinics').find({ _id: ObjectID(id) }).toArray();
        if (res.length) {
            return res[0];
        } else {
            return null;
        }
    }
    async sendRequest(id, uid, obj) {
        let _id;
        let appointment = await db.collection('appointments').find({ _id: ObjectID(id) }).toArray();
        let patient = await db.collection('patients').find({ _id: ObjectID(uid) }).toArray();
        let clinic = appointment[0].clinic;
        let admin = await db.collection('clinicAdmins').find({ clinic: clinic }).toArray();


        _id = ObjectID();
        obj._id = _id;
        obj.appointment = appointment[0]._id;
        obj.patient = patient[0]._id;
        // obj.actionCreated = true;
        // obj.verified = false;
        await db.collection('appointmentRequests').insertOne(obj);

        await db.collection('appointments').updateOne({ _id: appointment[0]._id }, {
            $set: {
                actionCreated: true

            }
        });

        for (let i = 0; i < admin.length; i++) {
            this.sendMail(admin[i].email, "Zakazivanje pregleda", "Pacijent zeli da zakaze pregled");
        }

        return {
            id: _id
        }
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



}

module.exports = Patient;