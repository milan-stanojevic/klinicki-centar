// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
// Configure chai
chai.use(chaiHttp);
chai.should();


const adminOfClinicCenterToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkY2M1ZTJiMWFjZmY0ZTdkYmQzOTBjMSIsImlhdCI6MTU3NjE4NDc2Mn0.7RXZfE4sRFsAIlsxUMx99CFsfWn6mTPOeb8INqlAcN4';


describe("Admin of clinic center", () => {
    describe("POST /admin/login", () => {
        it("should login with predefined credentials", (done) => {
            chai.request(app)
                .post('/admin/login')
                .set("content-type", "application/json")
                .send({ username: 'admin', password: 'admin' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('token')
                    done();
                });
        });
        it("should not login with wrong password", (done) => {
            chai.request(app)
                .post('/admin/login')
                .set("content-type", "application/json")
                .send({ username: 'admin', password: 'adminXYZ' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('error')
                    done();
                });
        });
        it("should not login with wrong username", (done) => {
            chai.request(app)
                .post('/admin/login')
                .set("content-type", "application/json")
                .send({ username: 'adminXYZ', password: 'admin' })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('error')
                    done();
                });
        });

    });

    describe("GET /admin/clinic", () => {
        it("should not get list of clinics if not verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/clinic')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it("should get list of clinics if it is verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/clinic')
                .set('authorization', `Bearer ${adminOfClinicCenterToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe("GET /admin/medications", () => {
        it("should not get list of medications if not verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/clinic')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it("should get list of medications if it is verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/medications')
                .set('authorization', `Bearer ${adminOfClinicCenterToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe("GET /admin/diagnoses", () => {
        it("should not get list of diagnoses if not verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/clinic')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it("should get list of diagnoses if it is verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/diagnoses')
                .set('authorization', `Bearer ${adminOfClinicCenterToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });


    describe("GET /admin/patients", () => {
        it("should not get list of patients if not verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/clinic')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it("should get list of patients if it is verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/patients')
                .set('authorization', `Bearer ${adminOfClinicCenterToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe("GET /admin/admins", () => {
        it("should not get list of admins if not verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/admins')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it("should get list of admins if it is verifed by JWT token", (done) => {
            chai.request(app)
                .get('/admin/admins')
                .set('authorization', `Bearer ${adminOfClinicCenterToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });


});



