import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';


import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class DoctorsRating extends Component {
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
        if (!localStorage.clinicAdminToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/clinic/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
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
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Lista doktora i njihove ocijene</h3>
                        </Col>
                    </Row>
                  
                    <Row className="table-head">
                        <Col lg="3">
                            <span className="name">KORISNICKO IME</span>
                        </Col>
                        
                        <Col lg="3">
                            <span className="name">IME</span>
                        </Col>
                        <Col lg="3">
                            <span className="name">PREZIME</span>
                        </Col>

                        <Col lg="3">
                            <span className="name">OCIJENA</span>
                        </Col>

                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            if(item.type == "doctor")
                            return (
                            
                                <Row className="table-row" key={idx}>
                                    <Col lg="3">
                                        <span className="value">{item.username}</span>
                                    </Col>
                                    <Col lg="3">
                                        <span className="value">{item.firstName}</span>
                                    </Col>
                                    <Col lg="3">
                                        <span className="value">{item.lastName}</span>
                                    </Col>
                                    <Col lg="3">
                                        <span className="value">{item.rating/item.numberOfRating}</span>
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

export default Page(DoctorsRating)
