import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';
import PatientSearchClinicForm from '../../components/forms/patientSearchClinicForm';

//import editIcon from '../../assets/svg/edit.svg';
//import deleteIcon from '../../assets/svg/delete.svg';
//import adminIcon from '../../assets/svg/admin.svg';


import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class ClinicList extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        this.search = this.search.bind(this);

        this.state = {
            items: []
        };
    }

    componentDidMount() {
        this.get();
    }

    get() {
        if (!localStorage.patientToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/patient/clinic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                items: result
            })
        })

    }
    search(data) {
        if (!localStorage.patientToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/patient/clinic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
            },
            body: JSON.stringify(data),
        }).then((res) => res.json()).then((result) => {
            this.setState({
                items: result
            })
        })

    }



    render() {

        return (
            <div className="page-wrap">
                {
                    !localStorage.patientToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Lista klinika</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <PatientSearchClinicForm onSubmit={this.search} />
                        </Col>
                    </Row>
                    <Row className="table-head">
                        <Col lg="4">
                            <span className="name">NAZIV</span>
                        </Col>
                        <Col lg="4">
                            <span className="name">ADRESA</span>
                        </Col>
                        <Col lg="4">
                            <span className="name">OPIS</span>
                        </Col>


                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            return (
                                <Link to={`/patient/clinic/${item._id}`}>
                                    <Row className="table-row" key={idx}>
                                        <Col lg="4">
                                            <span className="value">{item.name}</span>
                                        </Col>
                                        <Col lg="4">
                                            <span className="value">{item.adress}</span>
                                        </Col>
                                        <Col lg="4">
                                            <span className="value">{item.description}</span>
                                        </Col>
                                    </Row>
                                </Link>
                            )
                        })
                    }

                </Container>
            </div>
        );
    }
}

export default Page(ClinicList);