import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';
import MedicalRecordForm from '../../components/forms/medicalRecordForm';


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
        fetch('http://127.0.0.1:4000/patient/medicalRecord', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`

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
                    !localStorage.patientToken & !localStorage.clinicUserToken ? <Redirect to='/login' /> : null
                
                }

                <Container fluid>

                    <Row className="page-title">
                        <Col lg="12">
                             <h3>Moj profil</h3>
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


                                <Container fluid className="table">

<Row className="page-title">
    <Col lg="12">
        <h3>Istorija bolesti</h3>
    </Col>
</Row>
<Row className="table-head">
    <Col lg="4">
        <span className="name">DIJAGNOZA</span>
    </Col>
    <Col lg="4">
        <span className="name">LEKOVI</span>
    </Col>
    <Col lg="4">
        <span className="name">DATUM</span>
    </Col>

    

</Row>
{
    this.state.initialValues && this.state.initialValues.illnessHistory && this.state.initialValues.illnessHistory.map((item, idx) => {
        return (
            <Row className="table-row" key={idx}>
                <Col lg="4">
                    <span className="value">{item.illnessName}</span>
                </Col>
                <Col lg="4">
                    <span className="value">{
                        item.medications && item.medications.map((medication) => {
                            return <span>{medication.name}</span>
                        })
                    }</span>
                </Col>
                <Col lg="4">
                    <span className="value">{item.date}</span>
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
