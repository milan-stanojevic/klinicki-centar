import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Page from '../../containers/admin/page';

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
                            <h3>Pocetna stranica</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-6"><Link to='/patient/clinic'>
                            <div class="table-box">
                                <p>Lista svih klinika</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-6"><a href="">
                            <div class="table-box">
                                <p>Istorija pregled i operacija</p>
                            </div>
                        </a></div>

                        <div class="col-6 col-lg-6"><a href="">
                            <div class="table-box">
                                <p>Zdravstveni karton</p>
                            </div>
                        </a></div>

                        <div class="col-6 col-lg-6"><Link to="/patient/update">
                            <div class="table-box">
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
