import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import ExaminationForm from '../../components/forms/examinationForm';




import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class Examination extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.state = {
            diagnoses: [],
            medications: [],
            appointmentRequest: {}
        };
    }

    add(data) {
        console.log(data);

        fetch('http://127.0.0.1:4000/doctor/insertMedicalRecord/'+this.props[0].match.params.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((result) => {
            if (result.error) {
                this.setState({
                    error: result.error
                })
                return;
            }
            this.props[0].history.push('/doctor')
        })
    }

    componentDidMount() {

        fetch('http://127.0.0.1:4000/doctor/diagnoses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                diagnoses: result
            })
        })
        fetch('http://127.0.0.1:4000/doctor/medications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                medications: result
            })
        })

        fetch('http://127.0.0.1:4000/clinic/appointmentRequests/'+this.props[0].match.params.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                appointmentRequest: result
            })
        })


        


    }


    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicUserToken ? <Redirect to='/login' /> : null
                
                }

                <Container fluid>

                    <Row className="page-title">
                        <Col lg="12">
                             <h3>Pregled pacijenta</h3>
                        </Col>
                    </Row>
                    {this.state.initialValues ?
                        <ExaminationForm medications={this.state.medications} diagnoses={this.state.diagnoses} initialValues={this.state.initialValues} onSubmit={this.add} /> //ClinicForm
                        :
                        <ExaminationForm medications={this.state.medications} diagnoses={this.state.diagnoses} onSubmit={this.add} />
                    }
                    {
                        this.state.error ?

                            <p>{this.state.error}</p>
                            :
                            null
                    }
                </Container>
                <Container fluid className="bottom-wrap">
                    <Row>
                        <Col lg="3">
                            <a  href={`/doctor/makingAppointment/`+this.state.appointmentRequest.patient}>
                                <button id="new-appointment-button">Zakazi novi pregled</button>
                            </a>
                        </Col>
                    
                        <Col lg="9">
                            <a  target="_blank" href={`/doctor/examination/fillMedicalRecord/`+this.state.appointmentRequest.patient}>
                                <button>Izmjeni karton</button>
                            </a>
                        </Col>
                    </Row>
                </Container>
               



            </div>
        );
    }
}

export default Page(Examination);