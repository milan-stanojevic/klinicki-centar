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



app.get('/admin/medications/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.medication(req.params.id));
});

app.post('/admin/medications/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.medicationUpdate(req.params.id, req.body));
});


app.get('/admin/diagnoses/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.diagnose(req.params.id));
});

app.post('/admin/diagnoses/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.diagnoseUpdate(req.params.id, req.body));
});

app.get('/admin/medications', isAdminAuthenticated, async (req, res) => {
    console.log('fetch')
    res.send(await adminModule.medications());
});

app.get('/admin/diagnoses', isAdminAuthenticated, async (req, res) => {
    console.log('fetch')
    res.send(await adminModule.diagnoses());
});


app.delete('/admin/medications/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.medicationDelete(req.params.id));
});

app.delete('/admin/diagnoses/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.diagnoseDelete(req.params.id));
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

app.post('/admin/patients/notify/:id', isAdminAuthenticated, async (req, res) => {
    res.send(await adminModule.notifyUser(req.params.id, req.body));
});

app.post('/admin/admins/update/:id', isAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await adminModule.adminUpdate(req.params.id, req.body));
});
app.post('/admin/changePassword', isAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await adminModule.adminChangePassword(uid, req.body));
});

app.get('/admin/checkPasswordChange', isAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await adminModule.checkPasswordChange(uid));
});

app.get('/admin/admins', isAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await adminModule.admins(uid));
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
app.get('/patient/update', isPatientAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await patientModule.patient(uid));
});
app.post('/patient/update', isPatientAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await patientModule.updatePatient(uid, req.body));
});
app.post('/patient/clinic', isPatientAuthenticated, async (req, res) => {
    res.send(await patientModule.clinicList(req.body));
});
app.post('/patient/clinic/doctors', isPatientAuthenticated, async (req, res) => {
    res.send(await patientModule.doctorsList(req.body));
});
app.post('/patient/clinic/appointements', isPatientAuthenticated, async (req, res) => {
    res.send(await patientModule.appointementsList());
});






app.get('/patient/medicalRecord', isPatientAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await patientModule.medicalRecord(uid));
});




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
app.get('/clinic/vacationRequests', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.vacationRequests());
});
app.get('/clinic/vacationRequests/allow/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.allowReq(req.params.id));
});
app.get('/clinic/vacationRequests/disallow/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.disallowReq(req.params.id));
});
app.post('/clinic/vacationRequests/notify/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.notifyUser(req.params.id, req.body));
});

app.post('/clinic/data', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUpdate(uid, req.body));
});


app.post('/clinic/users/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.updateClinicUser(uid, req.params.uid, req.body));
});
app.post('/clinic/appointments/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.updateClinicAppointments(uid, req.params.uid, req.body));
});
app.get('/clinic/appointments', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicAppointments(uid,req.body));
});

app.post('/clinic/types/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.updateClinicTypes(uid, req.params.uid, req.body));
});
app.post('/clinic/types', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicTypes(uid,req.body));
});
app.delete('/clinic/types/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicTypeDelete(uid, req.params.uid));
});
app.post('/clinic/ordination/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.updateClinicOrdinations(uid, req.params.uid, req.body));
});
app.post('/clinic/ordinations', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicOrdinations(uid,req.body));
});
app.delete('/clinic/ordinations/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicOrdinationDelete(uid, req.params.uid));
});


app.get('/clinic/users/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUser(uid, req.params.uid));
});


app.post('/clinic/users', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUsers(uid,req.body));
});
app.get('/clinic/doctors', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.clinicDoctors());
});
app.get('/clinic/type', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.clinicType());
});
app.get('/clinic/ordination', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.clinicOrdination());
});

app.delete('/clinic/users/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUserDelete(uid, req.params.uid));
});


app.post('/clinic/vacationRequest', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.vacationRequest(uid, req.body));
})

app.get('/clinic/patients/:sort', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.patients(req.params.sort));
});
app.post('/clinic/patientsSearch', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.patientsSearch(req.body));
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
app.get('/doctor/patient/:id',isClinicAdminAuthenticated , async (req, res) => {
    res.send(await clinicModule.patient(req.params.id));
});



