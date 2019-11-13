import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../containers/page';

import logo from '../assets/images/logo.png';
import bg from '../assets/images/login-bg.png';

import upArrow from '../assets/svg/up.svg';
import downArrow from '../assets/svg/down.svg';

import editIcon from '../assets/svg/edit.svg';
import deleteIcon from '../assets/svg/delete.svg';
import visitIcon from '../assets/svg/visit.svg';


import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class ReservationsPage extends Component {
    constructor(props) {
        super(props);
        this.fetchPages = this.fetchPages.bind(this);
        this.allowReservation = this.allowReservation.bind(this);

        this.state = {
            items: []
        };
    }

    componentDidMount() {
        this.fetchPages();
    }


    componentDidUpdate(prevProps) {
        if (prevProps[0].location.pathname != this.props[0].location.pathname) {
            this.fetchPages();
        }
    }

    fetchPages() {
        if (!localStorage.token) {
            return;
        }

        fetch('https://sunrise.novamedia.agency/admin/reservations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        }).then((res) => res.json()).then((result) => {
            console.log(result);
            this.setState({
                items: result
            })
        })

    }

    allowReservation(id, status) {
        if (!localStorage.token) {
            return;
        }

        fetch('https://sunrise.novamedia.agency/admin/allowReservation/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                
            },
            body: JSON.stringify({status: status})
        }).then((res) => this.fetchPages())
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
                            <h3>Sve stranice</h3>
                        </Col>
                    </Row>
                    <Row className="table-head">
                        {/*<Col lg="1">
                            <div className="checkbox-wrap">
                                <div className="checkbox"></div>
                            </div>
            </Col>*/}
                        <Col lg="2">
                            {/*<div className="sort-wrap">
                                <button><Isvg src={upArrow} /><Isvg src={downArrow} /></button>

        </div>*/}
                            <span className="name">STATUS</span>
                        </Col>
                        <Col lg="2">
                            {/*<div className="sort-wrap">
                                <button><Isvg src={upArrow} /><Isvg src={downArrow} /></button>

        </div>*/}
                            <span className="name">DATUM</span>
                        </Col>
                        <Col lg="2">
                            {/*<div className="sort-wrap">
                                <button><Isvg src={upArrow} /><Isvg src={downArrow} /></button>

        </div>*/}
                            <span className="name">BROJ STOLA</span>
                        </Col>


                        <Col lg="3">
                            {/*<div className="sort-wrap">
                                <button><Isvg src={upArrow} /><Isvg src={downArrow} /></button>

        </div>*/}
                            <span className="name">KORISNIK</span>
                        </Col>
                        <Col lg="3" className="actions">

                            <span className="name">OPCIJE</span>
                        </Col>

                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>
                                    {/* <Col lg="1">
                                        <div className="checkbox-wrap">
                                            <div className="checkbox"></div>
                                        </div>
                            </Col>*/}
                                    <Col lg="2" className="reservation-status">
                                        <div className={item.allowed ? 'valid-reservation' : item.actionCreated ? 'not-valid-reservation' : 'undefined-reservation'}></div>
                                        <span className="value">{item.allowed ? 'ODOBRENO' : item.actionCreated ? 'ODBIJENO' : ''}</span>
                                    </Col>

                                    <Col lg="2">
                                        <span className="value">{item.reservationDate}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.tableNumber}</span>
                                    </Col>

                                    <Col lg="3">
                                        <span className="value">{item.user.name}</span>
                                    </Col>

                                    <Col lg="3" className="actions">
                                        {item.actionCreated ?
                                            item.allowed ?
                                                <button className="button1" onClick={() => { this.allowReservation(item._id, false) }}>ODBIJ</button>
                                                :
                                                <button className="button" onClick={() => { this.allowReservation(item._id, true) }}>ODOBRI</button>
                                            :
                                            <button className="button" onClick={() => { this.allowReservation(item._id, true) }}>ODOBRI</button>

                                        }
                                    </Col>

                                </Row>

                            )
                        })
                    }


                </Container>

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

export default Page(ReservationsPage);