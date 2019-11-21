import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';


class patientsList extends Component {

    render() {
        return (
            <div className="page-wrap">
                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Lista pacijenata</h3>
                        </Col>
                    </Row>
                    <Row className="table-head">
                        <Col lg="3">
                            <span className="name">IME</span>
                        </Col>
                        <Col lg="3">
                            <span className="name">Prezime</span>
                        </Col>
                        <Col lg="3">
                            <span className="name">Datum rodjenja</span>
                        </Col>
                        <Col lg="3" className="actions">
                            <span className="name">OPCIJE</span>
                        </Col>

                    </Row>
                    {/* {
                        this.state.items.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>
                                    <Col lg="3">
                                        <span className="value">{item.name}</span>
                                    </Col>
                                    <Col lg="3">
                                        <span className="value">{item.lastname}</span>
                                    </Col>
                                    <Col lg="3">
                                        <span className="value">{item.date}</span>
                                    </Col>
                                    <Col lg="3" className="actions">
                                        <Link to={`/admin/clinic/${item._id}`}><Isvg src={editIcon} /></Link>
                                        <Link to={`/admin/clinic/${item._id}/admins`}><Isvg src={adminIcon} /></Link>

                                        <button onClick={() => this.delete(item._id)}><Isvg src={deleteIcon} /></button>
                                    </Col>
                                </Row>
                            )
                        })
                    }  */}

                </Container>
            </div>
        )
    }
}

export default patientsList
