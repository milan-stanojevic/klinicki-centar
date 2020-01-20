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
    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Lista doktora i njihove ocene</h3>
                        </Col>
                    </Row>
                  
                    <Row className="table-head">
                        <Col lg="3">
                            <span className="name">KORISNICKO IME</span>
                        </Col>
                        
                        <Col lg="2">
                            <span className="name">IME</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">PREZIME</span>
                        </Col>

                        <Col lg="5">
                            <span className="name">Ocena</span>
                        </Col>

                    </Row>
                    {/* {
                        this.state.items.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>
                                    <Col lg="3">
                                        <span className="value">{item.username}</span>
                                    </Col>
                                    <Col lg="3">
                                        <span className="value">{item.type}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.firstName}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.lastName}</span>
                                    </Col>

                                    <Col lg="2" className="actions">
                                        <button onClick={() => this.delete(item._id)}><Isvg src={deleteIcon} /></button>
                                    </Col>
                                </Row>
                            )
                        })
                    } */}

                </Container>

    
            </div>
        );
    }
}

export default Page(DoctorsRating)
