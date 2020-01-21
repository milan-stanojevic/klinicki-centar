import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import moment from 'moment';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

import PatientNotifyForm from '../../components/forms/patientNotifyForm';

class vacationRequest extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        this.allow = this.allow.bind(this);
        this.disallow = this.disallow.bind(this);
        this.notify = this.notify.bind(this);

        this.state = {
            items: []
        };
    }

    componentDidMount() {
        this.get();
    }

    get() {
        if (!localStorage.clinicAdminToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/clinic/vacationRequests', {
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

    }

    allow(id, uid) {
        if (!localStorage.clinicAdminToken) {
            return;
        }

        this.setState({
            modal: uid
        })



        fetch('http://127.0.0.1:4000/clinic/vacationRequests/allow/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

            },
        }).then((res) => this.get())
    }


    disallow(id, uid) {
        if (!localStorage.clinicAdminToken) {
            return;
        }


        this.setState({
            modal: uid
        })

        fetch('http://127.0.0.1:4000/clinic/vacationRequests/disallow/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

            },
        }).then((res) => this.get())
    }

    notify(data) {
        if (!localStorage.clinicAdminToken) {
            return;
        }



        fetch('http://127.0.0.1:4000/clinic/vacationRequests/notify/' + this.state.modal, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

            },
            body: JSON.stringify(data)
        }).then((res) => {
            this.setState({ modal: null })
            this.get()
        })
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
                            <h3>Zahtjevi za godisnji odmor ili odsustvo</h3>
                        </Col>
                    </Row>
                    <Row className="table-head">
                        {/*<Col lg="1">
                            <div className="checkbox-wrap">
                                <div className="checkbox"></div>
                            </div>
            </Col>*/}
                        <Col lg="2">
                            {/*<div className="sort-wrap">
                                <button><Isvg src={upArrow} /><Isvg src={downArrow} /></button>

        </div>*/}
                            <span className="name">STATUS</span>
                        </Col>
                        <Col lg="2">
                            {/*<div className="sort-wrap">
                                <button><Isvg src={upArrow} /><Isvg src={downArrow} /></button>

        </div>*/}
                            <span className="name">DATUM</span>
                        </Col>
                        <Col lg="2">
                            {/*<div className="sort-wrap">
                                <button><Isvg src={upArrow} /><Isvg src={downArrow} /></button>

        </div>*/}
                            <span className="name">KORISNICKO IME</span>
                        </Col>


                        <Col lg="2"></Col>
                        <Col lg="4" className="actions">

                            <span className="name">OPCIJE</span>
                        </Col>

                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>
                                    {/* <Col lg="1">
                                        <div className="checkbox-wrap">
                                            <div className="checkbox"></div>
                                        </div>
                            </Col>*/}
                                    <Col lg="2" className="reservation-status">
                                        <div className={item.verified ? 'valid-reservation' : item.actionCreated ? 'not-valid-reservation' : 'undefined-reservation'}></div>
                                        <span className="value">{item.verified ? 'ODOBRENO' : item.actionCreated ? 'ODBIJENO' : ''}</span>
                                    </Col>

                                    <Col lg="2">
                                        <span className="value">{item.date}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.user.username}</span>
                                    </Col>

                                    <Col lg="2">
                                    </Col>

                                    <Col lg="4" className="actions">
                                        {/* {item.actionCreated ?
                                            item.verified ?
                                                <button className="button1" onClick={() => { this.disallow(item._id, item.uid) }}>ODBIJ</button>
                                                :
                                                <button className="button" onClick={() => { this.allow(item._id, item.uid) }}>ODOBRI</button>
                                            :
                                            <button className="button" onClick={() => { this.allow(item._id, item.uid) }}>ODOBRI</button>

                                        } */}
                                        <Row>
                                            <button className="button" onClick={() => { this.allow(item._id, item.uid) }}>ODOBRI</button>
                                            <button className="button1" onClick={() => { this.disallow(item._id, item.uid) }}>ODBIJ</button>
                                        </Row>
                                    </Col>

                                </Row>

                            )
                        })
                    }


                </Container>
                {this.state.modal ?
                    <div className="modal-container">
                        <h3>Razlog</h3>

                        <PatientNotifyForm onSubmit={this.notify} />
                    </div>

                    :

                    null

                }

                {/*<Container fluid className="bottom-wrap">
                    <Row>
                        <Col lg="12">
                            <Link to='/pages/new'>
                                <button>Add page</button>
                            </Link>
                        </Col>
                    </Row>

                </Container>*/}


            </div>
        );
    }
}

export default Page(vacationRequest);