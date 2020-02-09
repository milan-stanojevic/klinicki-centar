// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
// Configure chai
chai.use(chaiHttp);
chai.use(require('chai-like'));
chai.use(require('chai-things')); // Don't swap these two

chai.should();
var expect = chai.expect;



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let patientToken = null;
let clinicAdminToken = null;
let doctorId = null;
let typeId = null;
let ordinationId = null;
let clinicId = null;
let appointmentId = null;
let doctorToken = null;
let doctorAppointmentId = null;
let doctorPatientId = null;

let appointmentWithoutOrdination = null;

describe("UnitTests", async () => {
    await sleep(2000)
  




    describe("Admin klinike", () => {
        it("se moze ulogovati sa korisnickim podacima", (done) => {
            chai.request(app)
                .post('/clinic/admin/login')
                .set("content-type", "application/json")
                .send({ username: 'domzdravlja_admin', password: 'domzdravlja2020' })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('token')
                    clinicAdminToken = res.body.token;
                    done();
                });
        });
        it("se ne moze ulogovati sa pogresnim podacima", (done) => {
            chai.request(app)
                .post('/clinic/admin/login')
                .set("content-type", "application/json")
                .send({ username: 'domzdravlja_admin', password: 'pogresnasifra' })
                .end((err, res) => {
                    
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('error')
                    done();
                });
        });

        it("moze dobiti listu doktora", (done) => {
            chai.request(app)
                .get('/clinic/doctorss')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${clinicAdminToken}`)
                .send({ })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for(let i=0;i<res.body.length;i++){
                        if (res.body[i].type == 'doctor'){
                            doctorId = res.body[i]._id;
                            break;
                        }
                    }
                    done();
                });
        });

        it("moze dobiti listu ordinacija", (done) => {
            chai.request(app)
                .get('/clinic/ordinationn')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${clinicAdminToken}`)
                .send({ })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    if (res.body.length){
                        ordinationId = res.body[0]._id;
                    }
                    done();
                });
        });
        it("moze dobiti listu tipova pregleda", (done) => {
            chai.request(app)
                .get('/clinic/typee')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${clinicAdminToken}`)
                .send({ })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    if (res.body.length){
                        typeId = res.body[0]._id;
                    }
                    done();
                });
        });



        it("moze kreirati slobodan termin", (done) => {
            chai.request(app)
                .post('/clinic/appointments/new')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${clinicAdminToken}`)
                .send({ date: '10.03.2020, 00:00', duration: 30, doctor: doctorId, ordination: ordinationId, type: typeId, price: 50 })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id')
                    done();
                });
        });

        it("moze kreirati slobodan termin", (done) => {
            chai.request(app)
                .post('/clinic/appointments/new')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${clinicAdminToken}`)
                .send({ date: '10.04.2020, 00:00', duration: 30, doctor: doctorId, ordination: ordinationId, type: typeId, price: 50 })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id')
                    done();
                });
        });


    });


      describe("Pacijent", () => {
        it("se moze ulogovati sa korisnickim podacima", (done) => {
            chai.request(app)
                .post('/patient/login')
                .set("content-type", "application/json")
                .send({ username: 'pacijent', password: 'pacijent' })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('token')
                    patientToken = res.body.token;
                    done();
                });
        });
        it("se ne moze ulogovati sa pogresnim podacima", (done) => {
            chai.request(app)
                .post('/patient/login')
                .set("content-type", "application/json")
                .send({ username: 'pacijent', password: 'pogresnasifra' })
                .end((err, res) => {
                    
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('error')
                    done();
                });
        });
        it("moze dobiti listu svih klinika", (done) => {
            chai.request(app)
                .post('/patient/clinic/0')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${patientToken}`)
                .send({ })
                .end((err, res) => {
                    
                    
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    clinicId = res.body[0]._id;
                    done();
                });
        });

        it("moze pretrazivati klinike", (done) => {
            chai.request(app)
                .post('/patient/clinic/0')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${patientToken}`)
                .send({ search: 'Dom zdravlja' })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    expect(res.body).to.be.an('array').that.contains.something.like({name: 'Dom zdravlja'});
                    done();
                });
        });

        it("moze dobiti listu slobodnih termina za kliniku", (done) => {
            chai.request(app)
                .post('/patient/clinic/appointements/'+clinicId)
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${patientToken}`)
                .send({ })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for(let i=0;i<res.body.length;i++){
                        if (res.body[i].date == '10.03.2020, 00:00'){
                            appointmentId = res.body[i]._id;
                            break;
                        }
                    }
                    done();
                });
        });

        it("moze zakazati pregled u slobodnom terminu", (done) => {
            chai.request(app)
                .post('/patient/appointmentRequests/'+appointmentId)
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${patientToken}`)
                .send({ })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id')
                    done();
                });
        });



    });



    describe("Doktor", () => {
        it("se moze ulogovati sa korisnickim podacima", (done) => {
            chai.request(app)
                .post('/clinic/user/login')
                .set("content-type", "application/json")
                .send({ username: 'doktor1-domzdravlja', password: 'doktor2020' })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('token')
                    doctorToken = res.body.token;
                    done();
                });
        });
        it("se ne moze ulogovati sa pogresnim podacima", (done) => {
            chai.request(app)
                .post('/clinic/user/login')
                .set("content-type", "application/json")
                .send({ username: 'doktor1-domzdravlja', password: 'pogresnasifra' })
                .end((err, res) => {
                    
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('error')
                    done();
                });
        });

        it("moze dobiti listu zakazanih termina", (done) => {
            chai.request(app)
                .get('/doctor/appointments')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${doctorToken}`)
                .send({ })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    doctorAppointmentId = res.body[0].appReq;
                    done();
                });
        });

        it("moze dobiti detalje o zakazanom terminu", (done) => {
            chai.request(app)
                .get('/clinic/appointmentRequests/'+doctorAppointmentId)
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${doctorToken}`)
                .send({ })
                .end((err, res) => {

                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    doctorPatientId = res.body.patient;
                    done();
                });
        });

        it("moze zakazati novi pregled tokom pregleda", (done) => {
            chai.request(app)
                .post('/doctor/makingAppointment/'+doctorPatientId)
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${doctorToken}`)
                .send({date: '10.04.2020, 00:00', duration: 30, doctor: doctorId, type: typeId, price: 150 })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });


    });




    describe("Admin klinike", () => {
       
        it("moze dobiti listu zahtjeva za pregled", (done) => {
            chai.request(app)
                .get('/clinic/appointmentRequests')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${clinicAdminToken}`)
                .send({ })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for(let i=0;i<res.body.length;i++){
                        if (!res.body[i].appointment.ordination){
                            appointmentWithoutOrdination = res.body[i];
                            break;
                        }
                    }
                    done();
                });
        });

        it("moze odobriti novi zahtjev za pregled", (done) => {
            chai.request(app)
                .get('/clinic/appointmentRequests/allow/'+appointmentWithoutOrdination._id)
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${clinicAdminToken}`)
                .send({ })
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    done();
                });
        });

        it("moze rezervisati salu za novi zahtjev za pregled", (done) => {
            chai.request(app)
                .post('/clinic/appointmentRequests/reserveRoom/'+appointmentWithoutOrdination.appointment._id)
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${clinicAdminToken}`)
                .send(appointmentWithoutOrdination.freeOrdinations[0])
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    done();
                });
        });


    });

   

});



