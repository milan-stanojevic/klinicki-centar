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
const { Builder, By, Key, until } = require('selenium-webdriver');


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use('/uploads', express.static('uploads'))
const server = http.createServer(app);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

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
    console.log(result.status)
    res.status(result.status).send(result.response);
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
app.post('/clinic/changePasswordCA', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await clinicModule.clinicAdminChangePassword(uid, req.body));
});

app.post('/doctor/changePassword', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await clinicModule.doctorChangePassword(uid, req.body));
});



app.get('/admin/checkPasswordChange', isAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await adminModule.checkPasswordChange(uid));
});
app.get('/admin/checkPasswordChangeCA', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await clinicModule.checkPasswordChangeCA(uid));
});
app.get('/admin/checkPasswordChangeDoc', isAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await clinicModule.checkPasswordChangeDoc(uid));
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
    res.status(result.status).send(result.response);
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
app.post('/patient/clinic/:sort', isPatientAuthenticated, async (req, res) => {
    res.send(await patientModule.clinicList(req.body,req.params.sort));
});
// app.get('/clinic/patients/:sort', isClinicAdminAuthenticated, async (req, res) => {
//     res.send(await clinicModule.patients(req.params.sort));
// });
app.post('/patient/clinic/doctors/:id', isPatientAuthenticated, async (req, res) => {
    // console.log(req.params.id);
    res.send(await patientModule.doctorsList(req.body, req.params.id));
});
app.post('/patient/clinic/appointements/:id', isPatientAuthenticated, async (req, res) => {
    console.log(req.params.id);
    res.send(await patientModule.appointementsList(req.params.id));
});
app.post('/patient/appointmentRequests/:id', isPatientAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await patientModule.sendRequest(req.params.id, uid, req.body));
});
app.get('/patient/clinic/history/:sort', isPatientAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    console.log(uid);
    res.send(await patientModule.illnessHistory(uid,req.params.sort));
});
app.get('/patient/clinic/history/rateAllowed', isPatientAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    console.log(uid);
    res.send(await patientModule.rateAllowed(uid));
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
    res.status(result.status).send(result.response);
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
app.get('/clinic/appointmentRequests', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.appointmentRequests(uid));
});
app.get('/clinic/appointmentRequests/allow/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.allowReqAppointment(req.params.id));
});
app.post('/clinic/appointmentRequests/reserveRoom/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.reserveRoom(req.params.id, req.body));
});
app.post('/clinic/appointmentRequests/setDoctors/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.setDoctors(req.params.id, req.body));
});


app.get('/clinic/appointmentRequests/disallow/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.disallowReqAppointment(req.params.id));
});
app.post('/clinic/appointmentRequests/notify/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.notifyPatient(req.params.id, req.body));
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
app.get('/clinic/clinicRating', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicRating(uid));
});
app.get('/clinic/income', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicIncome(uid));
});





app.post('/clinic/users/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.updateClinicUser(uid, req.params.uid, req.body));
});
app.post('/clinic/appointments/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.updateClinicAppointments(uid, req.params.uid, req.body));
});
app.post('/doctor/makingAppointment/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.makeNewAppointments(uid, req.params.uid, req.body));
});


app.get('/clinic/appointmentRequests/:id', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicAppointmentRequest(req.params.id));
});


app.get('/clinic/appointments', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicAppointments(uid, req.body));
});

app.post('/clinic/types/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.updateClinicTypes(uid, req.params.uid, req.body));
});
app.post('/clinic/types', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicTypes(uid, req.body));
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
    res.send(await clinicModule.clinicOrdinations(uid, req.body));
});
app.delete('/clinic/ordinations/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicOrdinationDelete(uid, req.params.uid));
});
app.get('/clinic/ordinations/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicOrd(uid, req.params.uid));
});
app.get('/clinic/types/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinictype(uid, req.params.uid));
});



app.get('/clinic/users/:uid', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUser(uid, req.params.uid));
});


app.post('/clinic/users', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicUsers(uid, req.body));
});
app.get('/clinic/doctors', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicDoctors(uid));
});
app.get('/clinic/doctorss', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicDoctorss(uid));
});
app.get('/clinic/type', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicType(uid));
});
app.get('/clinic/typee', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicTypee(uid));
});

app.get('/patient/clinic/grading', isPatientAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await patientModule.clinicGrading(uid));
});
app.post('/patient/clinic/rating', isPatientAuthenticated, async (req, res) => {
    console.log("===========");
    console.log(req.body);
    res.send(await patientModule.clinicRating(req.body));
});
app.get('/patient/clinic/gradingDoctor', isPatientAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await patientModule.doctorGrading(uid));
});
app.post('/patient/doctor/rating', isPatientAuthenticated, async (req, res) => {
    console.log(req.body);
    res.send(await patientModule.doctorRating(req.body));
});



app.get('/patient/clinic/doctors/type', isPatientAuthenticated, async (req, res) => {
    res.send(await patientModule.clinicType());
});


app.get('/clinic/ordination', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.clinicOrdination());
});
app.get('/clinic/ordinationn', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.clinicOrdinationn(uid));
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
app.get('/doctor/patient/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.patient(req.params.id));
});

app.get('/doctor/patient/:id/medicalRecord',isClinicAdminAuthenticated , async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.medicalRecord(req.params.id, uid));
});

app.get('/doctor/medicalRecord/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.medicalRecordItem(req.params.id));
});
app.post('/doctor/updateMedicalRecord/:id', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    console.log(uid);
    res.send(await clinicModule.updateMedicalRecord(uid, req.params.id, req.body));
});
app.post('/doctor/examination/fillMedicalRecord/:id', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.fillMedicalRecord(req.params.id, req.body));
});


app.get('/doctor/medications', isClinicAdminAuthenticated, async (req, res) => {
    console.log('fetch')
    res.send(await clinicModule.medications());
});

app.get('/doctor/diagnoses', isClinicAdminAuthenticated, async (req, res) => {
    console.log('fetch')
    res.send(await clinicModule.diagnoses());
});
app.get('/doctor/appointments', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    console.log(uid);
    res.send(await clinicModule.scheduledAppointments(uid));
});




app.post('/doctor/insertMedicalRecord/:id', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;

    res.send(await clinicModule.insertMedicalRecord(uid, req.params.id, req.body));
});


app.get('/doctor/finishedAppointments', isClinicAdminAuthenticated, async (req, res) => {
    console.log('finishedApp')
    res.send(await clinicModule.finishedAppointments());
})

app.get('/doctor/recipeAuth/verify/:id', isClinicAdminAuthenticated, async (req, res) => {
    console.log('finishedApp')
    res.send(await clinicModule.recipeVerify(req.params.id));
})



app.get('/clinic/events', isClinicAdminAuthenticated, async (req, res) => {
    res.send(await clinicModule.events());
});
app.get('/clinic/completedEvents', isClinicAdminAuthenticated, async (req, res) => {
    let uid = res.locals.uid;
    res.send(await clinicModule.completedEvents(uid));
});



let lastCheckedTime = 0;

setInterval(async () => {
    let date = new Date();
    let timestamp = date.getTime() / 1000;

    if (date.getHours() == 0 && date.getMinutes() == 0 && timestamp - lastCheckedTime > 12 * 60 * 60) {
        lastCheckedTime = timestamp;


        let clinics = await clinicModule.allAppointmentRequests();

        for (let i = 0; i < clinics.length; i++) {
            for (let j = 0; j < clinics[i].requests.length; j++) {
                if (clinics[i].requests[j].verified && !clinics[i].requests[j].appointment.ordination && clinics[i].requests[j].freeOrdinations.length) {
                    console.log('reserving room')
                    await clinicModule.reserveRoom(clinics[i].requests[j].appointment._id, clinics[i].requests[j].freeOrdinations[0]);
                }
            }

        }


    } else {
        return;
    }
}, 30000);


async function dbPrepareTest(){

    await adminModule.dbTrunc();

    let clinic1 = await adminModule.clinicUpdate('new', {name: 'Dom zdravlja', adress: 'Bijeljinska 25'});
    let clinic2 = await adminModule.clinicUpdate('new', {name: 'Smedico', adress: '27 Marta 35' });


    let clinic1Admin = await adminModule.clinicAdminUpdate(clinic1.id.toString(), 'new', {
        username: 'domzdravlja_admin',
        password: 'test',
        email: 'admin@test.com'

    });

    await clinicModule.clinicAdminChangePassword(clinic1Admin.id.toString(), {
        password: 'domzdravlja2020'
    });


    await clinicModule.updateClinicTypes(clinic1Admin.id.toString(), 'new', {
        tag: 'examination-001',
        name: 'Redovni pregled'
    })

    await clinicModule.updateClinicOrdinations(clinic1Admin.id.toString(), 'new', {
        tag: 'room-1',
        name: 'Ordinacija #1'
    });

    await clinicModule.updateClinicUser(clinic1Admin.id.toString(), 'new', {
        username: 'dokotor1-domzdravnja',
        password: 'dokotor2020',
        type: 'doctor',
        firstName: 'Janko',
        lastName: 'Jankovic',
        email: 'doktor@test.com'
    })

    let patient = await patientModule.register({
        email: 'test@test.com',
        firstName: 'Pero',
        lastName: 'Petrovic',
        username: 'pacijent',
        password: 'pacijent'
    })

    await adminModule.allowPatient(patient.response.id.toString());
}

async function dbPrepare(){

    await adminModule.dbTrunc();

    let clinic1 = await adminModule.clinicUpdate('new', {name: 'Klinika1', adress: 'Bulevar Oslobodjenja 33'});
    let clinic2 = await adminModule.clinicUpdate('new', {name: 'Klinika2', adress: 'Bulevar Cara Dusana 117' });
    let clinic3 = await adminModule.clinicUpdate('new', {name: 'Klinika3', adress: 'Narodnog Fronta 7' });
    let clinic4 = await adminModule.clinicUpdate('new', {name: 'Klinika3', adress: 'Safarikova 31' });


    let clinic1Admin = await adminModule.clinicAdminUpdate(clinic1.id.toString(), 'new', {
        username: 'admin1',
        password: 'lozinka',
        email: 'admin@test.com'

    });
    await clinicModule.clinicAdminChangePassword(clinic1Admin.id.toString(), {
        password: 'lozinka'
    });
    let clinic2Admin = await adminModule.clinicAdminUpdate(clinic1.id.toString(), 'new', {
        username: 'admin2',
        password: 'lozinka',
        email: 'admin@test.com'

    });
    await clinicModule.clinicAdminChangePassword(clinic1Admin.id.toString(), {
        password: 'lozinka'
    });
    let clinic3Admin = await adminModule.clinicAdminUpdate(clinic3.id.toString(), 'new', {
        username: 'admin3',
        password: 'lozinka',
        email: 'admin@test.com'

    });
    await clinicModule.clinicAdminChangePassword(clinic3Admin.id.toString(), {
        password: 'lozinka'
    });
    let clinic4Admin = await adminModule.clinicAdminUpdate(clinic2.id.toString(), 'new', {
        username: 'admin4',
        password: 'lozinka',
        email: 'admin@test.com'

    });
    await clinicModule.clinicAdminChangePassword(clinic2Admin.id.toString(), {
        password: 'lozinka'
    });

    await clinicModule.updateClinicTypes(clinic1Admin.id.toString(), 'new', {
        tag: 'redovni_pregled',
        name: 'Redovni pregled'
    })
    await clinicModule.updateClinicTypes(clinic1Admin.id.toString(), 'new', {
        tag: 'operacija_palca',
        name: 'Operacija palca'
    })
    await clinicModule.updateClinicTypes(clinic1Admin.id.toString(), 'new', {
        tag: 'sistematski_pregled',
        name: 'Sistamatski pregled'
    })
    await clinicModule.updateClinicTypes(clinic1Admin.id.toString(), 'new', {
        tag: 'operacija_oka',
        name: 'Operacija oka'
    })
    await clinicModule.updateClinicTypes(clinic3Admin.id.toString(), 'new', {
        tag: 'redovni_pregled',
        name: 'Redovni pregled'
    })
    await clinicModule.updateClinicTypes(clinic3Admin.id.toString(), 'new', {
        tag: 'operacija_krajnika',
        name: 'Operacija krajnika'
    })
    await clinicModule.updateClinicTypes(clinic3Admin.id.toString(), 'new', {
        tag: 'oftamoloski_pregled',
        name: 'Oftamoloski pregled'
    })

    await clinicModule.updateClinicOrdinations(clinic1Admin.id.toString(), 'new', {
        tag: 'room-1',
        name: 'Ordinacija #1'
    });
    await clinicModule.updateClinicOrdinations(clinic1Admin.id.toString(), 'new', {
        tag: 'room-2',
        name: 'Ordinacija #2'
    });
    await clinicModule.updateClinicOrdinations(clinic1Admin.id.toString(), 'new', {
        tag: 'room-3',
        name: 'Ordinacija #3'
    });
    await clinicModule.updateClinicOrdinations(clinic1Admin.id.toString(), 'new', {
        tag: 'room-4',
        name: 'Ordinacija #4'
    });
    await clinicModule.updateClinicOrdinations(clinic1Admin.id.toString(), 'new', {
        tag: 'room-5',
        name: 'Ordinacija #5'
    });
    await clinicModule.updateClinicOrdinations(clinic3Admin.id.toString(), 'new', {
        tag: 'room-101',
        name: 'Ordinacija #101'
    });
    await clinicModule.updateClinicOrdinations(clinic3Admin.id.toString(), 'new', {
        tag: 'room-102',
        name: 'Ordinacija #102'
    });
    await clinicModule.updateClinicOrdinations(clinic3Admin.id.toString(), 'new', {
        tag: 'room-103',
        name: 'Ordinacija #103'
    });



    await clinicModule.updateClinicUser(clinic1Admin.id.toString(), 'new', {
        username: 'dokotor1',
        password: 'lozinka',
        type: 'doctor',
        firstName: 'Janko',
        lastName: 'Jankovic',
        email: 'doktor@test.com'
    })
    await clinicModule.updateClinicUser(clinic1Admin.id.toString(), 'new', {
        username: 'dokotor2',
        password: 'lozinka',
        type: 'doctor',
        firstName: 'Petar',
        lastName: 'Petrovic',
        email: 'doktor@test.com'
    })
    await clinicModule.updateClinicUser(clinic2Admin.id.toString(), 'new', {
        username: 'dokotor3',
        password: 'lozinka',
        type: 'doctor',
        firstName: 'Milan',
        lastName: 'Milanovic',
        email: 'doktor@test.com'
    })
    await clinicModule.updateClinicUser(clinic3Admin.id.toString(), 'new', {
        username: 'dokotor4',
        password: 'lozinka',
        type: 'doctor',
        firstName: 'Sinan',
        lastName: 'Sakic',
        email: 'doktor@test.com'
    })
    await clinicModule.updateClinicUser(clinic2Admin.id.toString(), 'new', {
        username: 'sestra1',
        password: 'lozinka',
        type: 'nurse',
        firstName: 'Gordana',
        lastName: 'Gordic',
        email: 'doktor@test.com'
    })
    await clinicModule.updateClinicUser(clinic3Admin.id.toString(), 'new', {
        username: 'sestra2',
        password: 'lozinka',
        type: 'nurse',
        firstName: 'Dragana',
        lastName: 'Draganovic',
        email: 'doktor@test.com'
    })

    let patient1 = await patientModule.register({
        email: 'test@test.com',
        firstName: 'Pero',
        lastName: 'Petrovic',
        username: 'pacijent1',
        password: 'pacijent'
    })

    await adminModule.allowPatient(patient1.response.id.toString());

    let patient2 = await patientModule.register({
        email: 'test@test.com',
        firstName: 'Milos',
        lastName: 'Milosevic',
        username: 'pacijent2',
        password: 'pacijent'
    })

    await adminModule.allowPatient(patient2.response.id.toString());

    let patient3 = await patientModule.register({
        email: 'test@test.com',
        firstName: 'Spasoje',
        lastName: 'Spasic',
        username: 'pacijent3',
        password: 'pacijent'
    })

    await adminModule.allowPatient(patient3.response.id.toString());

    let patient4 = await patientModule.register({
        email: 'test@test.com',
        firstName: 'Bogoljub',
        lastName: 'Spasic',
        username: 'pacijent4',
        password: 'pacijent'
    })

    await adminModule.allowPatient(patient4.response.id.toString());
}


var isInTest = typeof global.it === 'function';


// if (isInTest){
//     dbPrepareTest();
// }
// else
//     dbPrepare();

export default app;