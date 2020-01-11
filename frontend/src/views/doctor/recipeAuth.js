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
        if (!localStorage.token) {
            return;
        }

        fetch('http://127.0.0.1:4000/admin/patients', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                items: result
            })
        })

    }

    allow(id) {
        if (!localStorage.token) {
            return;
        }

        this.setState({
            modal: id
        })



        fetch('http://127.0.0.1:4000/admin/patients/allow/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`

            },
        }).then((res) => this.get())
    }


    disallow(id) {
        if (!localStorage.token) {
            return;
        }


        this.setState({
            modal: id
        })

        fetch('http://127.0.0.1:4000/admin/patients/disallow/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`

            },
        }).then((res) => this.get())
    }

    notify(data) {
        if (!localStorage.token) {
            return;
        }



        fetch('http://127.0.0.1:4000/admin/patients/notify/' + this.state.modal, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`

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
                    !localStorage.token ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Overa recepta</h3>
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
                        this.state.items.map((item, idx) => {
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
                                            item.verified ?
                                                <button className="button1" onClick={() => { this.verify(item._id) }}>OVERI</button>
                                                :
                                                <span>Overeno</span>}
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

export default Page(RecipeAuth);