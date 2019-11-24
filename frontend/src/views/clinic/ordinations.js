import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import editIcon from '../../assets/svg/edit.svg';
import deleteIcon from '../../assets/svg/delete.svg';



import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class Ordinations extends Component {
    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Lista sala</h3>
                        </Col>
                    </Row>
                    <Row className="table-head">
                        <Col lg="9">
                            <span className="name">Oznaka</span>
                        </Col>
                        

                        <Col lg="3" className="actions">

                            <span className="name">OPCIJE</span>
                        </Col>

                    </Row>
                    {/* {
                        this.state.items.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>
                                    <Col lg="5">
                                        <span className="value">{item.username}</span>
                                    </Col>
                                    <Col lg="4">
                                        <span className="value">{item.type}</span>
                                    </Col>

                                    <Col lg="3" className="actions">
                                        <Link to={`/clinic/users/${item._id}`}><Isvg src={editIcon} /></Link>
                                        <button onClick={() => this.delete(item._id)}><Isvg src={deleteIcon} /></button>
                                    </Col>
                                </Row>
                            )
                        })
                    } */}

                </Container>

                <Container fluid className="bottom-wrap">
                    <Row>
                        <Col lg="12">
                            <Link to={`/clinic/ordination/new`}>
                                <button>Nova sala</button>
                            </Link>
                        </Col>
                    </Row>

                </Container>

            </div>
        )
    }
}

export default Page(Ordinations)
