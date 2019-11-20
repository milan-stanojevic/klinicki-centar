import React, { Component } from 'react'

import {
    Container,
    Row,
    Col,
} from 'reactstrap';

const required = value => value ? undefined : "Required"

class docHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {

        return (
            <div className="page-wrap">
                {/* {
                    !localStorage.token ? <Redirect to='/admin/login' /> : null
                } */}

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Pocetna stranica</h3>
                        </Col>
                    </Row>
                    <Row className="table-row">
                        <div class="col-6 col-lg-4"><a href="">
                            <div class="table-box">
                                <p>Lista pacijenata</p>
                            </div>
                        </a></div>

                        <div class="col-6 col-lg-4"><a href="">
                            <div class="table-box">
                                <p>Novi pregled</p>
                            </div>
                        </a></div>

                        <div class="col-6 col-lg-4"><a href="">
                            <div class="table-box">
                                <p>Radni kalendar</p>
                            </div>
                        </a></div>

                        <div class="col-6 col-lg-4"><a href="">
                            <div class="table-box">
                                <p>Zahtevi za godisnji i odsustvo</p>
                            </div>
                        </a></div>

                        <div class="col-6 col-lg-4"><a href="">
                            <div class="table-box">
                                <p>Moj profil</p>
                            </div>
                        </a></div>

                        <div class="col-6 col-lg-4"><a href="">
                            <div class="table-box">
                                <p>Zakazivanje pregleda/operacija</p>
                            </div>
                        </a></div>


                    </Row>


                </Container>
            </div>
        )
    }
}

export default docHomePage
