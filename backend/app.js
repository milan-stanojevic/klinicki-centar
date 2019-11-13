const express = require("express");
const http = require("http");
const port = process.env.PORT || 4000;
//const nodemailer = require('nodemailer');
const cors = require('cors')
const bodyParser = require("body-parser");

const adminModule = new (require('./admin/admin'))();
const isAdminAuthenticated = require('./admin/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use('/uploads', express.static('uploads'))
const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));


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