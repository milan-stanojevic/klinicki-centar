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


