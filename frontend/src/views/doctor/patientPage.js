import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Page from '../../containers/admin/page';

import {
    Container,
    Row,
    Col,
} from 'reactstrap';


class PatientPage extends Component {

    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicUserToken ? <Redirect to='/login' /> : null
                }
                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Pacijent</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-6">
                            <Link to="/patient/medicalRecord">
                            
                                <div class="table-box">
                                    <p>Zdravstveni karton</p>
                                </div>
                            </Link>
                        </div>
                        <div class="col-6 col-lg-6">
                            <Link to="/doctor/patients">
                                <div class="table-box">
                                    <p>Zapocni pregled</p>
                                </div>
                            </Link>
                        </div>

                    </Row>



                </Container>


            </div>
        )
    }
}

export default Page(PatientPage)
