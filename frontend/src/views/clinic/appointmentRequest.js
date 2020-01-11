import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';
import Select from '../../components/forms/fields/select'
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


class AppointmentRequest extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        this.allow = this.allow.bind(this);
        this.disallow = this.disallow.bind(this);
        this.notify = this.notify.bind(this);
        this.reserveRoom = this.reserveRoom.bind(this);

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

        fetch('http://127.0.0.1:4000/clinic/appointmentRequests', {
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



        fetch('http://127.0.0.1:4000/clinic/appointmentRequests/allow/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

            },
        }).then((res) => this.get())
    }

    reserveRoom(id, ordination) {
        if (!localStorage.clinicAdminToken) {
            return;
        }




        fetch('http://127.0.0.1:4000/clinic/appointmentRequests/reserveRoom/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

            },
            body: JSON.stringify({ordination: ordination})
        }).then((res) => this.get())
    }


    disallow(id, uid) {
        if (!localStorage.clinicAdminToken) {
            return;
        }


        this.setState({
            modal: uid
        })

        fetch('http://127.0.0.1:4000/clinic/appointmentRequests/disallow/' + id, {
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

        fetch('http://127.0.0.1:4000/clinic/appointmentRequests/notify/' + this.state.modal, {
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
                            <h3>Zahtjevi za termine za pregled</h3>
                        </Col>
                    </Row>
                    <Row className="table-head">

                        <Col lg="2">
                            <span className="name">STATUS</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">DATUM</span>
                        </Col>
                        <Col lg="1">
                            <span className="name">PACIJENT</span>
                        </Col>


                        <Col lg="2">
                            <span className="name">DOKTOR</span>
                        </Col>
                        <Col lg="5" className="actions">
                            <span className="name">OPCIJE</span>
                        </Col>

                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>

                                    <Col lg="2" className="reservation-status">
                                        <div className={item.verified ? 'valid-reservation' : !item.appointment.actionCreated ? 'not-valid-reservation' : 'undefined-reservation'}></div>
                                        <span className="value">{item.verified ? 'ODOBRENO' : !item.appointment.actionCreated ? 'ODBIJENO' : ''}</span>
                                    </Col>

                                    <Col lg="2">
                                        <span className="value">{item.appointment.date}</span>
                                    </Col>
                                    <Col lg="1">
                                        <span className="value">{item.patient && item.patient.firstName + " " + item.patient && item.patient.lastName}</span>
                                    </Col>

                                    <Col lg="2">
                                        <span className="value">{item.appointment.doctor}</span>
                                    </Col>

                                    <Col lg="5" className="actions">
                                        {/* {item.appointment.actionCreated ?
                                            item.verified ?
                                                <button className="button1" onClick={() => { this.disallow(item._id, item.patient._id) }}>ODBIJ</button>
                                                :
                                                <button className="button" onClick={() => { this.allow(item._id, item.patient._id) }}>ODOBRI</button>
                                            :
                                            <button className="button" onClick={() => { this.allow(item._id, item.patient._id) }}>ODOBRI</button>

                                        } */}
                                        <Row>
                                            <button className="button" onClick={() => { this.allow(item._id, item.patient._id) }}>ODOBRI</button>
                                            <button className="button1" onClick={() => { this.disallow(item._id, item.patient._id) }}>ODBIJ</button>
                                            {
                                                item.verified && !item.appointment.ordination ?

                                                    <div className="choose-room">
                                                        
                                                        <Select placeholder="Izaberi salu" value={item.appointment.ordination} onChange={(val) => this.reserveRoom(item.appointment._id, val)}>
                                                            {
                                                                item.freeOrdinations.map((ordination, oidx) => {
                                                                    return (
                                                                        <option value={ordination}>{ordination.ordination.tag} | {ordination.start}</option>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </div>

                                                    : null

                                            }
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




            </div>
        );
    }
}

export default Page(AppointmentRequest)
