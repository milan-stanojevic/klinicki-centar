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

function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
}

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
        let admin = await db.collection('clinicAdmins').find({ _id: ObjectID(uid) }).toArray();
        console.log(admin[0]);
        let clinic = admin[0].clinic;
        let requests = await db.collection('appointmentRequests').find({$and : [{verified : true},{examinationDone : true}]}).toArray();
        // let appointments = await db.collection('appointments').find({ clinic: clinic }).toArray();
        let app = [];
        for(let i=0; i<requests.length; i++){
            let appointment = await db.collection('appointments').find({ $and :[{ _id: requests[i].appointment }, { clinic: clinic }]}).toArray();
            app.push(appointment[0]);
        }
        console.log(app);

        //danasnji datum
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        // today = dd + '.' + mm + '.' + yyyy;
        //dan prije 7 dana
        var someDate = new Date(Date.now() - 6048e5);
        // var oneWeek = new Date(Date.now() - 5184e5);
        // var twoWeek = new Date(oneWeek - 5184e5);
        // var threeWeek = new Date(twoWeek - 5184e5);
        // var fourWeek = new Date(threeWeek - 5184e5);
        console.log(today.getDay());



        var dateArray = [];
        var currentDate = moment(someDate);
        var stopDate = moment(today);
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format('DD.MM.YYYY'))
            currentDate = moment(currentDate).add(1, 'days');
        }
        //console.log(dateArray);
        let prvi = 0, drugi = 0, treci = 0, cetvrti = 0, peti = 0, sesti = 0, sedmi = 0, osmi = 0;
        let dat;
        for (let i = 0; i < app.length; i++) {
            dat = app[i].date.split(',');
            for (let j = 0; j < dateArray.length; j++) {

                if (dat[0] == dateArray[j]) {
                    if (j == 0) {
                        prvi++;
                    }
                    else if (j == 1) {
                        drugi++;
                    }
                    else if (j == 2) {
                        treci++;
                    }
                    else if (j == 3) {
                        cetvrti++;
                    }
                    else if (j == 4) {
                        peti++;
                    }
                    else if (j == 5) {
                        sesti++;
                    }
                    else if (j == 6) {
                        sedmi++;
                    }
                    else if (j == 8) {
                        osmi++;
                    }
                }
            }
        }
        let dayApps = [];
        dayApps.push(String(prvi));
        dayApps.push(String(drugi));
        dayApps.push(String(treci));
        dayApps.push(String(cetvrti));
        dayApps.push(String(peti));
        dayApps.push(String(sesti));
        dayApps.push(String(sedmi));
        dayApps.push(String(osmi));
        // console.log(dayApps);

        ////// NA SEDMICNOM NIVOU
        if (today.getDay() == 0) {
            var oneWeek = new Date(Date.now() - 5184e5);
            var twoWeek = new Date(oneWeek - 6048e5);
            var threeWeek = new Date(twoWeek - 6048e5);
            var fourWeek = new Date(threeWeek - 6048e5);
            // console.log(today.getDay(),oneWeek.getDay(),twoWeek.getDay(),threeWeek.getDay(),fourWeek.getDay())
            var dateArray1 = [];
            var currentDate1 = moment(oneWeek);
            var stopDate1 = moment(today);
            while (currentDate1 <= stopDate1 + 24 * 60 * 60000) {
                dateArray1.push(moment(currentDate1).format('DD.MM.YYYY'))
                currentDate1 = moment(currentDate1).add(1, 'days');
            }
            var dateArray2 = [];
            var currentDate2 = moment(twoWeek);
            var stopDate2 = moment(oneWeek);
            while (currentDate2 < stopDate2) {
                dateArray2.push(moment(currentDate2).format('DD.MM.YYYY'))
                currentDate2 = moment(currentDate2).add(1, 'days');
            }
            var dateArray3 = [];
            var currentDate3 = moment(threeWeek);
            var stopDate3 = moment(twoWeek);
            while (currentDate3 < stopDate3) {
                dateArray3.push(moment(currentDate3).format('DD.MM.YYYY'))
                currentDate3 = moment(currentDate3).add(1, 'days');
            }
            var dateArray4 = [];
            var currentDate4 = moment(fourWeek);
            var stopDate4 = moment(threeWeek);
            while (currentDate4 < stopDate4) {
                dateArray4.push(moment(currentDate4).format('DD.MM.YYYY'))
                currentDate4 = moment(currentDate4).add(1, 'days');
            }
            // console.log(dateArray4);
            // console.log(dateArray3);
            // console.log(dateArray2);
            // console.log(dateArray1);
        }
        else if (today.getDay() == 1) {
            var oneWeek = new Date(Date.now());
            var twoWeek = new Date(oneWeek - 6048e5);
            var threeWeek = new Date(twoWeek - 6048e5);
            var fourWeek = new Date(threeWeek - 6048e5);
            // console.log(today.getDay(),oneWeek.getDay(),twoWeek.getDay(),threeWeek.getDay(),fourWeek.getDay())
            var dateArray1 = [];
            var currentDate1 = moment(oneWeek);
            var stopDate1 = moment(today);
            while (currentDate1 <= stopDate1 + 24 * 60 * 60000) {
                dateArray1.push(moment(currentDate1).format('DD.MM.YYYY'))
                currentDate1 = moment(currentDate1).add(1, 'days');
            }
            var dateArray2 = [];
            var currentDate2 = moment(twoWeek);
            var stopDate2 = moment(oneWeek);
            while (currentDate2 < stopDate2) {
                dateArray2.push(moment(currentDate2).format('DD.MM.YYYY'))
                currentDate2 = moment(currentDate2).add(1, 'days');
            }
            var dateArray3 = [];
            var currentDate3 = moment(threeWeek);
            var stopDate3 = moment(twoWeek);
            while (currentDate3 < stopDate3) {
                dateArray3.push(moment(currentDate3).format('DD.MM.YYYY'))
                currentDate3 = moment(currentDate3).add(1, 'days');
            }
            var dateArray4 = [];
            var currentDate4 = moment(fourWeek);
            var stopDate4 = moment(threeWeek);
            while (currentDate4 < stopDate4) {
                dateArray4.push(moment(currentDate4).format('DD.MM.YYYY'))
                currentDate4 = moment(currentDate4).add(1, 'days');
            }
            // console.log(dateArray4);
            // console.log(dateArray3);
            // console.log(dateArray2);
            // console.log(dateArray1);
        }
        else if (today.getDay() == 2) {
            var oneWeek = new Date(Date.now() - 864e5);
            var twoWeek = new Date(oneWeek - 6048e5);
            var threeWeek = new Date(twoWeek - 6048e5);
            var fourWeek = new Date(threeWeek - 6048e5);
            // console.log(today.getDay(),oneWeek.getDay(),twoWeek.getDay(),threeWeek.getDay(),fourWeek.getDay())
            var dateArray1 = [];
            var currentDate1 = moment(oneWeek);
            var stopDate1 = moment(today);
            while (currentDate1 <= stopDate1 + 24 * 60 * 60000) {
                dateArray1.push(moment(currentDate1).format('DD.MM.YYYY'))
                currentDate1 = moment(currentDate1).add(1, 'days');
            }
            var dateArray2 = [];
            var currentDate2 = moment(twoWeek);
            var stopDate2 = moment(oneWeek);
            while (currentDate2 < stopDate2) {
                dateArray2.push(moment(currentDate2).format('DD.MM.YYYY'))
                currentDate2 = moment(currentDate2).add(1, 'days');
            }
            var dateArray3 = [];
            var currentDate3 = moment(threeWeek);
            var stopDate3 = moment(twoWeek);
            while (currentDate3 < stopDate3) {
                dateArray3.push(moment(currentDate3).format('DD.MM.YYYY'))
                currentDate3 = moment(currentDate3).add(1, 'days');
            }
            var dateArray4 = [];
            var currentDate4 = moment(fourWeek);
            var stopDate4 = moment(threeWeek);
            while (currentDate4 < stopDate4) {
                dateArray4.push(moment(currentDate4).format('DD.MM.YYYY'))
                currentDate4 = moment(currentDate4).add(1, 'days');
            }

        }
        else if (today.getDay() == 3) {
            var oneWeek = new Date(Date.now() - 2 * 864e5);
            var twoWeek = new Date(oneWeek - 6048e5);
            var threeWeek = new Date(twoWeek - 6048e5);
            var fourWeek = new Date(threeWeek - 6048e5);
            // console.log(today.getDay(),oneWeek.getDay(),twoWeek.getDay(),threeWeek.getDay(),fourWeek.getDay())
            var dateArray1 = [];
            var currentDate1 = moment(oneWeek);
            var stopDate1 = moment(today);
            while (currentDate1 <= stopDate1 + 24 * 60 * 60000) {
                dateArray1.push(moment(currentDate1).format('DD.MM.YYYY'))
                currentDate1 = moment(currentDate1).add(1, 'days');
            }
            var dateArray2 = [];
            var currentDate2 = moment(twoWeek);
            var stopDate2 = moment(oneWeek);
            while (currentDate2 < stopDate2) {
                dateArray2.push(moment(currentDate2).format('DD.MM.YYYY'))
                currentDate2 = moment(currentDate2).add(1, 'days');
            }
            var dateArray3 = [];
            var currentDate3 = moment(threeWeek);
            var stopDate3 = moment(twoWeek);
            while (currentDate3 < stopDate3) {
                dateArray3.push(moment(currentDate3).format('DD.MM.YYYY'))
                currentDate3 = moment(currentDate3).add(1, 'days');
            }
            var dateArray4 = [];
            var currentDate4 = moment(fourWeek);
            var stopDate4 = moment(threeWeek);
            while (currentDate4 < stopDate4) {
                dateArray4.push(moment(currentDate4).format('DD.MM.YYYY'))
                currentDate4 = moment(currentDate4).add(1, 'days');
            }
        }
        else if (today.getDay() == 4) {
            var oneWeek = new Date(Date.now() - 3 * 864e5);
            var twoWeek = new Date(oneWeek - 6048e5);
            var threeWeek = new Date(twoWeek - 6048e5);
            var fourWeek = new Date(threeWeek - 6048e5);
            // console.log(today.getDay(),oneWeek.getDay(),twoWeek.getDay(),threeWeek.getDay(),fourWeek.getDay())
            var dateArray1 = [];
            var currentDate1 = moment(oneWeek);
            var stopDate1 = moment(today);
            while (currentDate1 <= stopDate1 + 24 * 60 * 60000) {
                dateArray1.push(moment(currentDate1).format('DD.MM.YYYY'))
                currentDate1 = moment(currentDate1).add(1, 'days');
            }
            var dateArray2 = [];
            var currentDate2 = moment(twoWeek);
            var stopDate2 = moment(oneWeek);
            while (currentDate2 < stopDate2) {
                dateArray2.push(moment(currentDate2).format('DD.MM.YYYY'))
                currentDate2 = moment(currentDate2).add(1, 'days');
            }
            var dateArray3 = [];
            var currentDate3 = moment(threeWeek);
            var stopDate3 = moment(twoWeek);
            while (currentDate3 < stopDate3) {
                dateArray3.push(moment(currentDate3).format('DD.MM.YYYY'))
                currentDate3 = moment(currentDate3).add(1, 'days');
            }
            var dateArray4 = [];
            var currentDate4 = moment(fourWeek);
            var stopDate4 = moment(threeWeek);
            while (currentDate4 < stopDate4) {
                dateArray4.push(moment(currentDate4).format('DD.MM.YYYY'))
                currentDate4 = moment(currentDate4).add(1, 'days');
            }

        }
        else if (today.getDay() == 5) {
            var oneWeek = new Date(Date.now() - 4 * 864e5);
            var twoWeek = new Date(oneWeek - 6048e5);
            var threeWeek = new Date(twoWeek - 6048e5);
            var fourWeek = new Date(threeWeek - 6048e5);
            // console.log(today.getDay(),oneWeek.getDay(),twoWeek.getDay(),threeWeek.getDay(),fourWeek.getDay())
            var dateArray1 = [];
            var currentDate1 = moment(oneWeek);
            var stopDate1 = moment(today);
            while (currentDate1 <= stopDate1 + 24 * 60 * 60000) {
                dateArray1.push(moment(currentDate1).format('DD.MM.YYYY'))
                currentDate1 = moment(currentDate1).add(1, 'days');
            }
            var dateArray2 = [];
            var currentDate2 = moment(twoWeek);
            var stopDate2 = moment(oneWeek);
            while (currentDate2 < stopDate2) {
                dateArray2.push(moment(currentDate2).format('DD.MM.YYYY'))
                currentDate2 = moment(currentDate2).add(1, 'days');
            }
            var dateArray3 = [];
            var currentDate3 = moment(threeWeek);
            var stopDate3 = moment(twoWeek);
            while (currentDate3 < stopDate3) {
                dateArray3.push(moment(currentDate3).format('DD.MM.YYYY'))
                currentDate3 = moment(currentDate3).add(1, 'days');
            }
            var dateArray4 = [];
            var currentDate4 = moment(fourWeek);
            var stopDate4 = moment(threeWeek);
            while (currentDate4 < stopDate4) {
                dateArray4.push(moment(currentDate4).format('DD.MM.YYYY'))
                currentDate4 = moment(currentDate4).add(1, 'days');
            }

        }
        else if (today.getDay() == 6) {
            var oneWeek = new Date(Date.now() - 5 * 864e5);
            var twoWeek = new Date(oneWeek - 6048e5);
            var threeWeek = new Date(twoWeek - 6048e5);
            var fourWeek = new Date(threeWeek - 6048e5);
            // console.log(today.getDay(),oneWeek.getDay(),twoWeek.getDay(),threeWeek.getDay(),fourWeek.getDay())
            var dateArray1 = [];
            var currentDate1 = moment(oneWeek);
            var stopDate1 = moment(today);
            while (currentDate1 <= stopDate1 + 24 * 60 * 60000) {
                dateArray1.push(moment(currentDate1).format('DD.MM.YYYY'))
                currentDate1 = moment(currentDate1).add(1, 'days');
            }
            var dateArray2 = [];
            var currentDate2 = moment(twoWeek);
            var stopDate2 = moment(oneWeek);
            while (currentDate2 < stopDate2) {
                dateArray2.push(moment(currentDate2).format('DD.MM.YYYY'))
                currentDate2 = moment(currentDate2).add(1, 'days');
            }
            var dateArray3 = [];
            var currentDate3 = moment(threeWeek);
            var stopDate3 = moment(twoWeek);
            while (currentDate3 < stopDate3) {
                dateArray3.push(moment(currentDate3).format('DD.MM.YYYY'))
                currentDate3 = moment(currentDate3).add(1, 'days');
            }
            var dateArray4 = [];
            var currentDate4 = moment(fourWeek);
            var stopDate4 = moment(threeWeek);
            while (currentDate4 < stopDate4) {
                dateArray4.push(moment(currentDate4).format('DD.MM.YYYY'))
                currentDate4 = moment(currentDate4).add(1, 'days');
            }

        }
        // console.log(dateArray4);
        // console.log(dateArray3);
        // console.log(dateArray2);
        // console.log(dateArray1);
        prvi = 0; drugi = 0; treci = 0; cetvrti = 0;
        let datum;
        for (let i = 0; i < app.length; i++) {
            datum = app[i].date.split(',');
            for (let j = 0; j < dateArray1.length; j++) {
                if (datum[0] == dateArray1[j]) {
                    prvi++;
                }
            }
        }
        for (let i = 0; i < app.length; i++) {
            datum = app[i].date.split(',');
            for (let j = 0; j < dateArray2.length; j++) {
                if (datum[0] == dateArray2[j]) {
                    drugi++;
                }
            }
        }
        for (let i = 0; i < app.length; i++) {
            datum = app[i].date.split(',');
            for (let j = 0; j < dateArray3.length; j++) {
                if (datum[0] == dateArray3[j]) {
                    treci++;
                }
            }
        }
        for (let i = 0; i < app.length; i++) {
            datum = app[i].date.split(',');
            for (let j = 0; j < dateArray4.length; j++) {
                if (datum[0] == dateArray4[j]) {
                    prvi++;
                }
            }
        }
        let weekApps = [];
        let weekArray = [];
        weekApps.push(String(prvi));
        weekApps.push(String(drugi));
        weekApps.push(String(treci));
        weekApps.push(String(cetvrti));
        console.log(weekApps);
        let x = dateArray1[0] + " - " + dateArray1[dateArray1.length - 1];
        let y = dateArray2[0] + " - " + dateArray2[dateArray2.length - 1];
        let z = dateArray3[0] + " - " + dateArray3[dateArray3.length - 1];
        let w = dateArray4[0] + " - " + dateArray4[dateArray4.length - 1];
        weekArray.push(x);
        weekArray.push(y);
        weekArray.push(z);
        weekArray.push(w);
        // weekArray.push()

        // weekApps.push(String(drugi));
        // weekApps.push(String(treci));
        // weekApps.push(String(cetvrti));






        ///////



        //Na mjesecnom nivou
        let monthsArray = [];
        let month = Number(mm);
        for (let i = 0; i < 6; i++) {
            if (month > 0) {
                monthsArray[i] = String(month);
                month--;
            } else {
                month = 12;
                monthsArray[i] = String(month);
                month--;
            }
        }

        let monthApps = [];

        prvi = 0; drugi = 0; treci = 0; cetvrti = 0; peti = 0; sesti = 0;
        let monthNum;
        // console.log(app);
        for (let i = 0; i < app.length; i++) {
            monthNum = app[i].date.split('.');
            for (let j = 0; j < monthsArray.length; j++) {

                if (Number(monthNum[1]) == Number(monthsArray[j])) {
                    if (j == 0) {
                        prvi++;
                    }
                    else if (j == 1) {
                        drugi++;
                    }
                    else if (j == 2) {
                        treci++;
                    }
                    else if (j == 3) {
                        cetvrti++;
                    }
                    else if (j == 4) {
                        peti++;
                    }
                    else if (j == 5) {
                        sesti++;
                    }
                }
            }
        }
        monthApps.push(String(prvi));
        monthApps.push(String(drugi));
        monthApps.push(String(treci));
        monthApps.push(String(cetvrti));
        monthApps.push(String(peti));
        monthApps.push(String(sesti));
        // console.log(monthApps);

        for (let i = 0; i < monthsArray.length; i++) {
            if (monthsArray[i] == '1') {
                monthsArray[i] = 'Januar'
            }
            else if (monthsArray[i] == '2') {
                monthsArray[i] = 'Februar'
            }
            else if (monthsArray[i] == '3') {
                monthsArray[i] = 'Mart'
            }
            else if (monthsArray[i] == '4') {
                monthsArray[i] = 'April'
            }
            else if (monthsArray[i] == '5') {
                monthsArray[i] = 'Maj'
            }
            else if (monthsArray[i] == '6') {
                monthsArray[i] = 'Jun'
            }
            else if (monthsArray[i] == '7') {
                monthsArray[i] = 'Jul'
            }
            else if (monthsArray[i] == '8') {
                monthsArray[i] = 'Avgust'
            }
            else if (monthsArray[i] == '9') {
                monthsArray[i] = 'Septembar'
            }
            else if (monthsArray[i] == '10') {
                monthsArray[i] = 'Oktobar'
            }
            else if (monthsArray[i] == '11') {
                monthsArray[i] = 'Novembar'
            }
            else if (monthsArray[i] == '12') {
                monthsArray[i] = 'Decembar'
            }
        }
        let cut;
        for (let i = 0; i < dateArray.length; i++) {
            cut = dateArray[i].split('.');
            dateArray[i] = cut[0] + '.' + cut[1];
        }
        dateArray.reverse();
        dayApps.reverse();







        let result = [];
        result.push(monthsArray);
        result.push(monthApps);
        result.push(dateArray);
        result.push(dayApps);
        result.push(weekApps);
        result.push(weekArray);





        // let requests = await db.collection('appointmentRequests').find({ examinationDone: true }).toArray();

        // for (let i = 0; i < requests.length; i++) {
        //     let appointment = await db.collection('appointments').find({ _id: ObjectID(requests[i].appointment) }).toArray();
        //     let patient = await db.collection('patients').find({ _id: ObjectID(requests[i].patient) }).toArray();
        //     requests[i].patient = patient[0] ? patient[0] : {};
        //     requests[i].appointment = appointment[0];
        // }
        // for (let i = 0; i < requests.length; i++) {

        //     if (requests[i].appointment.doctor) {
        //         let doc = await db.collection('clinicUsers').find({ _id: ObjectID(requests[i].appointment.doctor) }).toArray();
        //         requests[i].docName = doc[0].firstName + ' ' + doc[0].lastName;
        //     }

        //     if (requests[i].appointment.ordination) {
        //         let ord = await db.collection('ordinations').find({ _id: ObjectID(requests[i].appointment.ordination) }).toArray();
        //         requests[i].ordinationTag = ord[0].tag;
        //     }

        //     let type = await db.collection('types').find({ _id: ObjectID(requests[i].appointment.type) }).toArray();
        //     requests[i].typeTag = type[0].tag;

        // }
        // return requests;
        return result;
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
        let doctor = await db.collection('clinicUsers').find({ _id: ObjectID(appointment[0].doctor) }).toArray();
        let appReq = await db.collection('appointmentRequests').find({ appointment: appointment[0]._id }).toArray();
        let patient = await db.collection('patients').find({ _id: appReq[0].patient }).toArray();


        await db.collection('appointments').updateOne({ _id: ObjectID(id) }, {
            $set: {
                ordination: obj.ordination._id,
                date: obj.start
            }
        });

        this.sendMail(doctor[0].email, "Rezervisana sala za operaciju", "Doktore " + doctor[0].firstName + " " + doctor[0].lastName + ", rezervisana je sala za operaciju");
        this.sendMail(patient[0].email, "Rezervisana sala za operaciju", "Postovani " + patient[0].firstName + " " + patient[0].lastName + ", rezervisana je sala za vasu operaciju");

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
                requests[i].availDoctors = await db.collection('clinicUsers').find({ clinic: admin[0].clinic, type: 'doctor', _id: { $ne: ObjectID(appointment[0].doctor) } }).toArray();
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
                            if ((start <= s && start >= s + d) || (start + duration <= s && start + duration >= s + d)) {
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
                            ordinationBusy = false;

                            start += 60;
                            let check = false;
                            for (let k = 0; k < requests.length; k++) {
                                if (i == k) {
                                    continue;
                                }

                                if (requests[k].appointment.ordination == ordinations[j]._id.toString()) {
                                    let s = Math.floor(moment(requests[k].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                                    let d = requests[k].appointment.duration * 60;
                                    // console.log(start,duration,s,d);
                                    // if ((start >= s && start < s + d) || (start + duration >= s && start + duration < s + d)) {
                                    if (dateRangeOverlaps(start, start + duration, s, s + d)) {
                                        ordinationBusy = true;
                                        break;
                                    }
                                    // else if(start > s && start > (s+d)){
                                    //     ordinationBusy = false;
                                    //     check = true;
                                    //     break;
                                    // }


                                }

                                if (ordinationBusy == true) {
                                    break;
                                }
                                if (check == true) {
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
                                ordinationBusy = false;

                                start += 60;
                                let check = false;
                                for (let k = 0; k < requests.length; k++) {
                                    if (i == k) {
                                        continue;
                                    }

                                    if (requests[k].appointment.ordination == ordinations[j]._id.toString()) {
                                        let s = Math.floor(moment(requests[k].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                                        let d = requests[k].appointment.duration * 60;
                                        // console.log(start,duration,s,d);
                                        // if ((start >= s && start < s + d) || (start + duration >= s && start + duration < s + d)) {
                                        if (dateRangeOverlaps(start, start + duration, s, s + d)) {
                                            ordinationBusy = true;
                                            break;
                                        }
                                        // else if(start > s && start > (s+d)){
                                        //     ordinationBusy = false;
                                        //     check = true;
                                        //     break;
                                        // }


                                    }

                                    if (ordinationBusy == true) {
                                        break;
                                    }
                                    if (check == true) {
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
                        ordinationBusy = false;

                        start += 60;
                        let check = false;
                        for (let k = 0; k < requests.length; k++) {

                            if (requests[k].appointment.ordination == ordinations[j]._id.toString()) {
                                let s = Math.floor(moment(requests[k].appointment.date, 'DD.MM.YYYY, HH:mm').toDate().getTime() / 1000);
                                let d = requests[k].appointment.duration * 60;
                                // console.log(start,duration,s,d);
                                // if ((start >= s && start < s + d) || (start + duration >= s && start + duration < s + d)) {
                                if (dateRangeOverlaps(start, start + duration, s, s + d)) {
                                    ordinationBusy = true;
                                    break;
                                }
                                // else if(start > s && start > (s+d)){
                                //     ordinationBusy = false;
                                //     check = true;
                                //     break;
                                // }


                            }

                            if (ordinationBusy == true) {
                                break;
                            }
                            if (check == true) {
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
                for (let j = 0; j < freeOrdinations.length; j++) {
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