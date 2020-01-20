import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';


class BusinessReport extends Component {
    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Izvestaj o poslovanju</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-6">
                            <div class="table-box">
                                <p>Prosecna ocena klinike</p>
                                <p>(4)</p>
                            </div>
                        </div>

                        <div class="col-6 col-lg-6"><Link to='/clinic/businessReport/doctors'>
                            <div class="table-box">
                                <p>Prosecne ocene lekara</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-6"><Link to='/clinic/businessReport/completedExaminations'>
                            <div class="table-box">
                                <p>Prikaz grafika zavrsenih pregleda</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-6">
                            <div class="table-box">
                                <p>Prihodi klinike</p>
                                <p>(4000)</p>
                            </div>
                        </div>
                    </Row>


                </Container>

            </div>
        )
    }
}

export default Page(BusinessReport)
