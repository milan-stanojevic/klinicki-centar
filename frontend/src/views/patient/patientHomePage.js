import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Page from '../../containers/admin/page';
import Isvg from 'react-inlinesvg';

import list from '../../assets/svg/list2.svg';
import profile from '../../assets/svg/profile.svg';
import patient from '../../assets/svg/patient.svg';
import history from '../../assets/svg/history.svg';


import {
    Container,
    Row,
    Col,
} from 'reactstrap';

const required = value => value ? undefined : "Required"

class patientHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }
    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.patientToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Početna stranica</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-6"><Link to='/patient/clinics'>
                            <div class="table-box">
                                <p><Isvg src={list} /></p>
                                <p>Lista svih klinika</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-6"><Link to='/patient/clinic/history'>
                            <div class="table-box">
                                <p><Isvg src={history} /></p>
                                <p>Istorija pregled i operacija</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-6"><Link to='/patient/medicalRecord'>
                            <div class="table-box">
                                <p><Isvg src={patient} /></p>
                                <p>Zdravstveni karton</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-6"><Link to="/patient/update">
                            <div class="table-box">
                                <p><Isvg src={profile} /></p>
                                <p>Moj profil</p>
                            </div>
                        </Link></div>
                    </Row>


                </Container>
            </div>
        )
    }
}

export default Page(patientHomePage)
