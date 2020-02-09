import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Page from '../../containers/admin/page';

import editIcon from '../../assets/svg/edit.svg';
import deleteIcon from '../../assets/svg/delete.svg';
import SearchForm from '../../components/forms/searchForm';
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

class Appointments extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);


        this.state = {
            items: []
        };
    }

    componentDidMount() {
        this.get();
    }

    get() {
        if (!localStorage.clinicUserToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/doctor/appointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`
            },
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
                    !localStorage.clinicUserToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Lista zakazanih termina</h3>
                        </Col>
                    </Row>

                    <Row className="table-head">
                        <Col lg="2">
                            <span className="name">Datum</span>
                        </Col>
                        <Col lg="1">
                            <span className="name">Trajanje</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Tip</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Sala</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Pacijent</span>
                        </Col>
                        <Col lg="1">
                            <span className="name">Cijena</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Započni pregled</span>
                        </Col>

                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            if(!item.examinationDone && item.verified)
                            return (
                                <Row className="table-row" key={idx}>
                                    <Col lg="2">
                                        <span className="value">{item.date}</span>
                                    </Col>
                                    <Col lg="1">
                                        <span className="value">{item.duration}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.typeTag}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.ordinationTag}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.patientName}</span>
                                    </Col>
                                    <Col lg="1">
                                        <span className="value">{item.price}</span>
                                    </Col>
                                    
                                    <Col lg="2">
                                        <button className="button" onClick={() => {
                                            this.props[0].history.push(`/doctor/examination/${item.appReq}`)}}> >> </button>
                                    </Col>

                                </Row>
                            )
                        })
                    }

                </Container>


            </div>
        )
    }
}

export default Page(Appointments);