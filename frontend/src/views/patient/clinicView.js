import React, { Component } from 'react'
import Page from '../../containers/admin/page';
import { Link, Redirect } from 'react-router-dom';

import {
    Container,
    Row,
    Col,
} from 'reactstrap';


class ClinicView extends Component {
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
                            <h3>Klinika</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-6"><Link to='/patient/clinic/doctors'>
                            <div class="table-box">
                                <p>Lista svih doktora</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-6"><Link to='/patient/clinic/appointements'>
                            <div class="table-box">
                                <p>Lista unaprijed kreiranih pregleda</p>
                            </div>
                        </Link></div>

                    </Row>


                </Container>
            </div>
        )
    }
}

export default Page(ClinicView)
