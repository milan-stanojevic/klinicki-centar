import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Page from '../../containers/admin/page';
import Isvg from 'react-inlinesvg';


import list from '../../assets/svg/list2.svg';
import calendar from '../../assets/svg/calendar.svg';
import vacation from '../../assets/svg/vacation.svg';
import profile from '../../assets/svg/profile.svg';
import prescription from '../../assets/svg/prescription.svg';
import appointment from '../../assets/svg/appointment.svg';





import {
    Container,
    Row,
    Col,
} from 'reactstrap';

const required = value => value ? undefined : "Required"

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

        fetch('http://127.0.0.1:4000/clinic/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`

            }
        }).then((res) => res.json()).then((result) => {
            this.setState(result)
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
                            <h3>Početna stranica</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-4"><Link to="/doctor/patients">
                            <div class="table-box">
                                <p><Isvg src={list} /></p>
                                <p>Lista pacijenata</p>
                            </div>
                        </Link></div>

                        {this.state.type != 'nurse' ?

                            <div class="col-6 col-lg-4"><a href="">
                                <div class="table-box">
                                    <p><Isvg src={appointment} /></p>
                                    <p>Novi pregled</p>
                                </div>
                            </a></div>

                            :
                            null
                        }

                        <div class="col-6 col-lg-4"><Link to="/doctor/calendar">
                            <div class="table-box">
                                <p><Isvg src={calendar} /></p>
                                <p>Radni kalendar</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-4"><Link to="/doctor/vacation">
                            <div class="table-box">
                                <p><Isvg src={vacation} /></p>
                                <p>Zahtjevi za godišnji</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-4"><Link to="/doctor/edit">
                            <div class="table-box">
                                <p><Isvg src={profile} /></p>
                                <p>Moj profil</p>
                            </div>
                        </Link></div>
                        {this.state.type != 'nurse' ?

                            <div class="col-6 col-lg-4"><Link to="/doctor/makingAppointment">
                                <div class="table-box">
                                    <p><Isvg src={appointment} /></p>
                                    <p>Zakazivanje pregleda</p>
                                </div>
                            </Link></div>
                            :
                            null
                        }

                        {this.state.type == 'nurse' ?
                            <div class="col-6 col-lg-4"><Link to="/doctor/recipeAuth">
                                <div class="table-box">
                                    <p><Isvg src={prescription} /></p>
                                    <p>Ovjera recepata</p>
                                </div>
                            </Link></div>

                            :

                            null
                        }



                    </Row>


                </Container>
            </div>
        )
    }
}

export default Page(Test);
