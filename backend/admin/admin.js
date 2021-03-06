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


const SMTPServer = Buffer.from('bWFpbC5odWdlbWVkaWEub25saW5l', 'base64').toString('ascii');
const SMTPPort = 465;
const SMTPUsername = Buffer.from('YWRtaW5AaHVnZW1lZGlhLm9ubGluZQ==', 'base64').toString('ascii');
const SMTPPassword = 'tSwFq%8e;LC%';


class Admin {
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

    async dbTrunc(){
        if (!db){
            db = await dbConnect();
        }

        await db.collection('admins').deleteMany({});
        await db.collection('clinics').deleteMany({});
        await db.collection('clinicUsers').deleteMany({});
        await db.collection('ordinations').deleteMany({});
        await db.collection('clinicAdmins').deleteMany({});
        await db.collection('patients').deleteMany({});
        await db.collection('appointments').deleteMany({});
        await db.collection('appointmentRequests').deleteMany({});     
        await db.collection('types').deleteMany({});        
   
        await db.collection('admins').insertOne({username: 'admin', pk: '$2b$10$aAdxTYM3XSa5XpqsDTgT1uXNJ3gbOBNzVhC4/9TX55dCUllAyAKfy'});
    }


    async login(username, password) {
        //console.log(db);   
        if (!db){
            db = await dbConnect();
        }
        let admin = await db.collection('admins').find({ username: username }).toArray();

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


    async checkPasswordChange(id){
        let admin = await db.collection('admins').find({_id: ObjectID(id)}).toArray();
        if (admin[0].changePasswordRequired){
            return {
                required: true
            }
        }else{
            return {
                required: false
            }
        }
    }

    async adminChangePassword(id, obj){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(obj.password, salt);

        await db.collection('admins').updateOne({_id: ObjectID(id)}, {$set: {
            pk: hash,
            changePasswordRequired: false
        }})

        return {
            
        }
    }

    async adminUpdate(id, obj) {
        let _id;


        if (id == 'new') {
            let check = await db.collection('admins').find({username: obj.username}).count();
            if (check){
                return {
                    error: `Administrator with username "${obj.username}" already exists`
                }
            }
            
            _id = ObjectID();
            obj._id = _id;

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(obj.password, salt);
            delete obj.password;
            obj.pk = hash;
            obj.changePasswordRequired = true;

            await db.collection('admins').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;

            let check = await db.collection('admins').find({username: obj.name, _id: {$ne: ObjectID(id) }}).count();
            if (check){
                return {
                    error: `Administrator with username "${obj.username}" already exists`
                }
            }
            obj.changePasswordRequired = true;

            if (obj.password){
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(obj.password, salt);
                delete obj.password;
                obj.pk = hash;
            }

            await db.collection('admins').updateOne({ _id: ObjectID(id) }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }

    async clinicList(){
        let res = await db.collection('clinics').find({}).sort({_id: -1}).toArray();
        return res;
    }

    async admins(){
        let res = await db.collection('admins').find({}).sort({_id: -1}).toArray();
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

    async medication(id){
        let res = await db.collection('medications').find({_id: ObjectID(id)}).toArray();
        if (res.length){
            return res[0];
        }else{
            return null;
        }
    }
    async diagnose(id){
        let res = await db.collection('diagnoses').find({_id: ObjectID(id)}).toArray();
        if (res.length){
            return res[0];
        }else{
            return null;
        }
    }


    async medications(){
        let res = await db.collection('medications').find({}).sort({_id: -1}).toArray();
        return res;
    }

    async diagnoses(){
        let res = await db.collection('diagnoses').find({}).sort({_id: -1}).toArray();
        return res;
    }
    async diagnoseDelete(id){
        await db.collection('diagnoses').deleteOne({_id: ObjectID(id)});
    }
    async medicationDelete(id){
        await db.collection('medications').deleteOne({_id: ObjectID(id)});
    }


    async medicationUpdate(id, obj) {
        let _id;


        if (id == 'new') {            
            _id = ObjectID();
            obj._id = _id;

            await db.collection('medications').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;
           
            await db.collection('medications').updateOne({ _id: ObjectID(id) }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }

    async diagnoseUpdate(id, obj) {
        let _id;


        if (id == 'new') {            
            _id = ObjectID();
            obj._id = _id;

            await db.collection('diagnoses').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;
           
            await db.collection('diagnoses').updateOne({ _id: ObjectID(id) }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }



    async clinicUpdate(id, obj) {
        let _id;


        if (id == 'new') {
            let check = await db.collection('clinics').find({name: obj.name}).count();
            if (check){
                return {
                    error: `Clinic with name "${obj.name}" already exists`
                }
            }
            
            _id = ObjectID();
            obj._id = _id;

            await db.collection('clinics').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;
            let check = await db.collection('clinics').find({name: obj.name, _id: {$ne: ObjectID(id) }}).count();
            if (check){
                return {
                    error: `Clinic with name "${obj.name}" already exists`
                }
            }

            await db.collection('clinics').updateOne({ _id: ObjectID(id) }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }

    async clinicDelete(id){
        await db.collection('clinics').deleteOne({_id: ObjectID(id)});
    }





    async clinicAdminList(cid){
        let res = await db.collection('clinicAdmins').find({clinic: cid}).sort({_id: -1}).toArray();
        return res;
    }

    async clinicAdmin(cid, id){
        let res = await db.collection('clinicAdmins').find({_id: ObjectID(id), clinic: cid }).toArray();
        if (res.length){
            return res[0];
        }else{
            return null;
        }
    }

    async clinicAdminUpdate(cid, id, obj) {
        let _id;


        if (id == 'new') {
            let check = await db.collection('clinicAdmins').find({username: obj.username}).count();
            if (check){
                return {
                    error: `Administrator with username "${obj.username}" already exists`
                }
            }
            
            _id = ObjectID();
            obj._id = _id;
            obj.clinic = cid;

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(obj.password, salt);
            delete obj.password;
            obj.pk = hash;
            obj.changePasswordRequired = true;


            await db.collection('clinicAdmins').insertOne(obj);
        } else {
            _id = id;
            delete obj._id;
            obj.clinic = cid;
            let check = await db.collection('clinicAdmins').find({username: obj.name, _id: {$ne: ObjectID(id) }}).count();
            if (check){
                return {
                    error: `Administrator with username "${obj.username}" already exists`
                }
            }

            if (obj.password){
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(obj.password, salt);
                delete obj.password;
                obj.pk = hash;
            }

            await db.collection('clinicAdmins').updateOne({ _id: ObjectID(id), clinic: cid }, {
                $set: obj
            })
        }

        return {
            id: _id
        };
    }

    async clinicAdminDelete(cid, id){
        await db.collection('clinicAdmins').deleteOne({_id: ObjectID(id), clinic: cid});
    }


    async allowPatient(id){
        await db.collection('patients').updateOne({_id: ObjectID(id)}, {$set: {
            actionCreated: true,
            verified: true
        }} );
    }

    async disallowPatient(id){
        await db.collection('patients').updateOne({_id: ObjectID(id)}, {$set: {
            actionCreated: true,
            verified: false
        }} );
    }

    async notifyUser(id, obj){
        let user = await db.collection('patients').find({_id: ObjectID(id)}).toArray();
        if (!user.length){
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

    async patients(){
        let res = await db.collection('patients').find({}).sort({_id: -1}).toArray();
        return res;
    }


    


}

module.exports = Admin;