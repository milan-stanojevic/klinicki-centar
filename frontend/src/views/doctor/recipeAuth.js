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

class RecipeAuth extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        this.verify = this.verify.bind(this);

        this.state = {
            items: []
        };
    }

    componentDidMount() {
        this.get();
    }

    get() {
        if (!localStorage.clinicUserToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/doctor/finishedAppointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                items: result
            })
        })

    }

    verify(id) {
        if (!localStorage.clinicUserToken) {
            return;
        }

        this.setState({
            modal: id
        })



        fetch('http://127.0.0.1:4000/doctor/recipeAuth/verify/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`

            },
        }).then((res) => this.get())
    }


  

    render() {

        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicUserToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Ovjera recepta</h3>
                        </Col>
                    </Row>
                    <Row className="table-head">
                    <Col lg="2">
                            <span className="name">DOKTOR</span>
                        </Col>
                        <Col lg="1">
                            <span className="name">PACIJENT</span>
                        </Col>

                        <Col lg="2">
                            <span className="name">DIJAGNOZA</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">LIJEKOVI</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">IZVJEŠTAJ</span>
                        </Col>
                        <Col lg="1">
                            <span className="name">DATUM</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">OPCIJE</span>
                        </Col>

                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>
                                                                       <Col lg="2">
                                        <span className="value">{item.illnessHistory.doctor && item.illnessHistory.doctor.firstName} {item.illnessHistory.doctor && item.illnessHistory.doctor.lastName}</span>
                                    </Col>
                                    <Col lg="1">
                                    <span className="value">{item.illnessHistory.patient && item.illnessHistory.patient.firstName} {item.illnessHistory.patient && item.illnessHistory.patient.lastName}</span>
                                    </Col>

                                    <Col lg="2">
                                        <span className="value">{item.illnessHistory.diagnose && item.illnessHistory.diagnose.name}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{
                                            item.illnessHistory.medications && item.illnessHistory.medications.map((medication) => {
                                                return <p>{medication.name} {medication.package} | {medication.manufacturer}</p>
                                            })
                                        }</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.illnessHistory.report}</span>
                                    </Col>

                                    <Col lg="1">
                                        <span className="value">{item.illnessHistory.date}</span>
                                    </Col>

                                    <Col lg="2" className="actions">
                                        {
                                            !item.recipeVerified ?
                                                <button className="button1" onClick={() => { this.verify(item._id) }}>OVJERI</button>
                                                :
                                                <span>OVJERENO</span>}
                                    </Col>

                                </Row>

                            )
                        })
                    }


                </Container>

            </div>
        );
    }
}

export default Page(RecipeAuth);