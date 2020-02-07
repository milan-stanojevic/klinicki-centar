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

describe("UnitTests", async () => {
    await sleep(2000)
    describe("Pacijent", () => {
        it("se moze ulogovati sa korisnickim podacima", (done) => {
            chai.request(app)
                .post('/patient/login')
                .set("content-type", "application/json")
                .send({ username: 'pacijent', password: 'pacijent' })
                .end((err, res) => {
                    console.log(res.body);
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
                    console.log(res.body);
                    console.log(res.status);
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('error')
                    done();
                });
        });
        it("moze dobiti listu svih klinika", (done) => {
            chai.request(app)
                .post('/patient/clinic')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${patientToken}`)
                .send({ })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it("moze pretrazivati klinike", (done) => {
            chai.request(app)
                .post('/patient/clinic')
                .set("content-type", "application/json")
                .set('authorization', `Bearer ${patientToken}`)
                .send({ search: 'Dom zdravlja' })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    expect(res.body).to.be.an('array').that.contains.something.like({name: 'Dom zdravlja'});
                    done();
                });
        });

    });





    describe("Admin klinike", () => {
        it("se moze ulogovati sa korisnickim podacima", (done) => {
            chai.request(app)
                .post('/clinic/admin/login')
                .set("content-type", "application/json")
                .send({ username: 'domzdravlja_admin', password: 'domzdravlja2020' })
                .end((err, res) => {
                    console.log(res.body);
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
                    console.log(res.body);
                    console.log(res.status);
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('error')
                    done();
                });
        });

    });


   

});



