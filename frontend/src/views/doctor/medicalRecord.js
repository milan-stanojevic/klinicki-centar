import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';
import MedicalRecordForm from '../../components/forms/medicalRecordForm';
import AdditionallyMedicalRecordForm from '../../components/forms/additionallyMedicalRecord';
import editIcon from '../../assets/svg/edit.svg';


import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class MedicalRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    componentDidMount() {
        fetch('http://127.0.0.1:4000/doctor/patient/' + this.props[0].match.params.id + '/medicalRecord', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`

            }
        }).then((res) => res.json()).then((result) => {
            this.setState({
                initialValues: result
            })
            console.log(result);
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
                            <h3>Zdravstevni karton</h3>
                        </Col>
                    </Row>
                    {this.state.initialValues ?
                        <MedicalRecordForm initialValues={this.state.initialValues} onSubmit={this.add} />
                        :
                        <MedicalRecordForm onSubmit={this.add} />
                    }
                    {
                        this.state.error ?

                            <p>{this.state.error}</p>
                            :
                            null
                    }
                </Container>
                <Container fluid>

                    
                    {this.state.initialValues ?
                        <AdditionallyMedicalRecordForm initialValues={this.state.initialValues.medicalRecord} />
                        :
                        <AdditionallyMedicalRecordForm />
                    }
                    {
                        this.state.error ?

                            <p>{this.state.error}</p>
                            :
                            null
                    }


                </Container>


                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Istorija bolesti</h3>
                        </Col>
                    </Row>
                    <Row className="table-head">
                        <Col lg="3">
                            <span className="name">DIJAGNOZA</span>
                        </Col>
                        <Col lg="3">
                            <span className="name">LEKOVI</span>
                        </Col>
                        <Col lg="3">
                            <span className="name">IZVJESTAJ</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">DATUM</span>
                        </Col>
                        <Col lg="1">
                            <span className="name">OPCIJE</span>
                        </Col>



                    </Row>
                    {
                        this.state.initialValues && this.state.initialValues.illnessHistory && this.state.initialValues.illnessHistory.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>
                                    <Col lg="3">
                                        <span className="value">{item.diagnose && item.diagnose.name}</span>
                                    </Col>
                                    <Col lg="3">
                                        <span className="value">{
                                            item.medications && item.medications.map((medication) => {
                                                return <span>{medication.name} {medication.package} | {medication.manufacturer}</span>
                                            })
                                        }</span>
                                    </Col>
                                    <Col lg="3">
                                        <span className="value">{item.report}</span>
                                    </Col>

                                    <Col lg="2">
                                        <span className="value">{item.date}</span>
                                    </Col>
                                    <Col lg="1" className="actions">
                                        {
                                            item.editRaport ?
                                                <Link to={`/doctor/medicalRecord/${this.props[0].match.params.id}/${item._id}`}><Isvg src={editIcon} /></Link>
                                                : null
                                        }
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

export default Page(MedicalRecord)
