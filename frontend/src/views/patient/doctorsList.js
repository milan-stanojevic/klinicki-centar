import React, { Component } from 'react'
import Page from '../../containers/admin/page';
import { Link, Redirect } from 'react-router-dom';
import SearchForm from '../../components/forms/searchForm';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class DoctorsList extends Component {
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

        fetch('http://127.0.0.1:4000/patient/clinic/doctors', {
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

        fetch('http://127.0.0.1:4000/patient/clinic/doctors', {
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
                            <h3>Lista doktora</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <SearchForm onSubmit={this.search} />
                        </Col>
                    </Row>
                    <Row className="table-head">
                        <Col lg="4">
                            <span className="name">IME</span>
                        </Col>
                        <Col lg="4">
                            <span className="name">Prezime</span>
                        </Col>
                        <Col lg="4">
                            <span className="name">tip</span>
                        </Col>


                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            if(item.type == 'doctor')
                            return (
                                // <Link to='/patient/clinic/doctors'>
                                
                                    <Row className="table-row" key={idx}>
                                        <Col lg="4">
                                            <span className="value">{item.firstName}</span>
                                        </Col>
                                        <Col lg="4">
                                            <span className="value">{item.lastName}</span>
                                        </Col>
                                        <Col lg="4">
                                            <span className="value">{item.type}</span>
                                        </Col>
                                    </Row>
                                // </Link>
                            )
                        })
                    }

                </Container>
            </div>
        );
    }
}

export default Page(DoctorsList)
