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
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);

        this.state = {
            items: []
        };
    }
    get() {
        if (!localStorage.clinicAdminToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/clinic/clinicRating', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                items: result
            })
        })
        fetch('http://127.0.0.1:4000/clinic/income', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                items1: result
            })
        })


    }

    componentDidMount() {
        this.get();
    }
    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Izvještaj o poslovanju</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-6">
                            <div class="table-box">
                                <p>Prosječna ocijena klinike (
                                {
                                        this.state.items.map((item, idx) => {
                                            return (
                                                item.name
                                            )
                                        })
                                    }
                                    )
                                </p>
                                <p>(
                                    {
                                        this.state.items.map((item, idx) => {
                                            return (
                                                parseFloat(Number(item.rating / item.numberOfRating)).toFixed(2)
                                            )
                                        })
                                    }
                                    )
                                </p>
                            </div>
                        </div>

                        <div class="col-6 col-lg-6"><Link to='/clinic/businessReport/doctors'>
                            <div class="table-box">
                                <p>Prosječne ocijene doktora</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-6"><Link to='/clinic/businessReport/completedExaminations'>
                            <div class="table-box">
                                <p>Prikaz grafika završenih pregleda</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-6">
                            <div class="table-box">
                                <p>Prihodi klinike</p>
                                <p>(
                                    {/* {
                                        this.state.items1.map((item, idx) => {
                                            return (
                                            )
                                        })
                                    } */}
                                    )</p>
                            </div>
                        </div>
                    </Row>


                </Container>

            </div>
        )
    }
}

export default Page(BusinessReport)
