const express = require("express");
const http = require("http");
const port = process.env.PORT || 4000;
//const nodemailer = require('nodemailer');
const cors = require('cors')
const bodyParser = require("body-parser");

const adminModule = new (require('./admin/admin'))();
const isAdminAuthenticated = require('./admin/auth');

const patientModule = new (require('./patient/patient'))();
const isPatientAuthenticated = require('./patient/auth');

// const doctorModule = new (require('./doctor/doctor'))();
// const isDoctorAuthenticated = require('./doctor/auth');

const clinicModule = new (require('./clinic/clinic'))();
const isClinicAdminAuthenticated = require('./clinic/auth');


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use('/uploads', express.static('uploads'))
const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));


/*
    ADMIN API ROUTES
*/

app.post('/admin/upload', isAdminAuthenticated, function (req, res) {
    res.send(adminModule.upload(req.body.file));
});

app.post('/admin/login', async (req, res) => {
    console.log(req.body);
    let result = await adminModule.login(req.body.username, req.body.password);
    res.send(result.response).status(result.status); 
});

app.post('/admin/verify', isAdminAuthenticated, (req, res) => {
    res.send({ valid: true }).status(200);
});

app.get('/admin/clinic', isAdminAuthenticated, async (req, res) => {
    console.log('fetch')
    res.send(await adminModule.clinicList());
});

app.get('/admin/clinic/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.clinic(req.params.id));
});

app.post('/admin/clinic/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.clinicUpdate(req.params.id, req.body));
});

app.delete('/admin/clinic/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.clinicDelete(req.params.id));
});



app.get('/admin/clinic/:cid/admins', isAdminAuthenticated, async (req, res) => {
    console.log('fetch')
    res.send(await adminModule.clinicAdminList(req.params.cid));
});

app.get('/admin/clinic/:cid/admins/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.clinicAdmin(req.params.cid, req.params.id));
});

app.post('/admin/clinic/:cid/admins/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.clinicAdminUpdate(req.params.cid, req.params.id, req.body));
});

app.delete('/admin/clinic/:cid/admins/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.clinicAdminDelete(req.params.cid, req.params.id));
});

app.get('/admin/patients/allow/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.allowPatient(req.params.id));
});
app.get('/admin/patients/disallow/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.disallowPatient(req.params.id));
});

app.get('/admin/patients', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.patients());
});


/*
    PATIENT API
*/

app.post('/patient/login', async (req, res) => {
    console.log(req.body);
    let result = await patientModule.login(req.body.username, req.body.password);
    res.send(result.response).status(result.status); 
});

app.post('/patient/register', async (req, res) => {
    console.log(req.body);
    let result = await patientModule.register(req.body);
    res.send(result.response).status(result.status); 
});

app.post('/patient/verify', isPatientAuthenticated, (req, res) => {
    res.send({ valid: true }).status(200);
});

/*
    DOCTOR API
*/

// app.post('/doctor/login', async (req, res) => {
//     console.log(req.body);
//     let result = await doctorModule.login(req.body.username, req.body.password);
//     res.send(result.response).status(result.status); 
// });

// app.post('/doctor/register', async (req, res) => {
//     console.log(req.body);
//     let result = await doctorModule.register(req.body);
//     res.send(result.response).status(result.status); 
// });


/*
    CLINICS API
*/

app.post('/clinic/admin/login', async (req, res) => {
    console.log(req.body);
    let result = await clinicModule.login(req.body.username, req.body.password);
    res.send(result.response).status(result.status); 
});


app.post('/clinic/user/login', async (req, res) => {
    console.log(req.body);
    let result = await clinicModule.userLogin(req.body.username, req.body.password);
    res.send(result.response).status(result.status); 
});


app.get('/clinic/data', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicData(uid));
});


app.post('/clinic/data', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUpdate(uid, req.body));
});


app.post('/clinic/users/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.updateClinicUser(uid, req.params.uid, req.body));
});

app.get('/clinic/users/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUser(uid, req.params.uid));
});


app.get('/clinic/users', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUsers(uid));
});

app.delete('/clinic/users/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUserDelete(uid, req.params.uid));
});

app.get('/clinic/patients', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.patients());
});

app.get('/clinic/user', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUser(uid));
});

app.post('/clinic/user/update', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    console.log(uid);
    res.send(await clinicModule.updateUserProfile(uid, req.body));
});

app.post('/clinic/admin/update', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    console.log(uid);
    res.send(await clinicModule.updateClinicAdmin(uid, req.body));
});
app.get('/clinic/admin/update', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicAdmin(uid));
});



