import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Page from '../../containers/admin/page';
import Isvg from 'react-inlinesvg';
import patient from '../../assets/svg/patient.svg';
import appointment from '../../assets/svg/appointment.svg';


import {
    Container,
    Row,
    Col,
} from 'reactstrap';


class PatientPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    componentDidMount() {
        fetch('http://127.0.0.1:4000/doctor/patient/' + this.props[0].match.params.id, {
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
                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Pacijent</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-6">
                            <Link to={"/doctor/patient/" + this.props[0].match.params.id + "/medicalRecord"}>

                                <div class="table-box">
                                    <p><Isvg src={patient} /></p>
                                    <p>Zdravstveni karton</p>
                                </div>
                            </Link>
                        </div>
                        <div class="col-6 col-lg-6">
                            <Link to="/doctor/patients">
                                <div class="table-box">
                                    <p><Isvg src={appointment} /></p>
                                    <p>Zapocni pregled</p>
                                </div>
                            </Link>
                        </div>

                    </Row>
                    


                </Container>


            </div>
        )
    }
}

export default Page(PatientPage)
