import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Page from '../../containers/admin/page';

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
                            <h3>Pocetna stranica</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-4"><Link to="/doctor/patients">
                            <div class="table-box">
                                <p>Lista pacijenata</p>
                            </div>
                        </Link></div>

                        {this.state.type != 'nurse' ?

                            <div class="col-6 col-lg-4"><a href="">
                                <div class="table-box">
                                    <p>Novi pregled</p>
                                </div>
                            </a></div>

                            :
                            null
                        }

                        <div class="col-6 col-lg-4"><Link to="/doctor/calendar">
                            <div class="table-box">
                                <p>Radni kalendar</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-4"><Link to="/doctor/vacation">
                            <div class="table-box">
                                <p>Zahtevi za godisnji i odsustvo</p>
                            </div>
                        </Link></div>

                        <div class="col-6 col-lg-4"><Link to="/doctor/edit">
                            <div class="table-box">
                                <p>Moj profil</p>
                            </div>
                        </Link></div>
                        {this.state.type != 'nurse' ?

                            <div class="col-6 col-lg-4"><a href="">
                                <div class="table-box">
                                    <p>Zakazivanje pregleda/operacija</p>
                                </div>
                            </a></div>
                            :
                            null
                        }

                        {this.state.type == 'nurse' ?
                            <div class="col-6 col-lg-4"><a href="">
                                <div class="table-box">
                                    <p>Overa recepata</p>
                                </div>
                            </a></div>

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
