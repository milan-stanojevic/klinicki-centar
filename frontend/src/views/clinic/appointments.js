import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import editIcon from '../../assets/svg/edit.svg';
import deleteIcon from '../../assets/svg/delete.svg';
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

class Appointments extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        // this.delete = this.delete.bind(this);
        // this.search = this.search.bind(this);

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

        fetch('http://127.0.0.1:4000/clinic/types', {
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
    // search(data) {
    //     if (!localStorage.clinicAdminToken) {
    //         return;
    //     }

    //     fetch('http://127.0.0.1:4000/clinic/types', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
    //         },
    //         body: JSON.stringify(data),
    //     }).then((res) => res.json()).then((result) => {
    //         this.setState({
    //             items: result
    //         })
    //     })

    // }

    // delete(id) {
    //     if (!localStorage.clinicAdminToken) {
    //         return;
    //     }

    //     fetch('http://127.0.0.1:4000/clinic/types/' + id, {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

    //         },
    //     }).then((res) => this.get())
    // }

    render() {

        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Lista slobodnih termina</h3>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col lg="12">
                            <SearchForm onSubmit={this.search}/>
                        </Col>
                    </Row> */}
                    <Row className="table-head">
                        <Col lg="3">
                            <span className="name">Datum pregleda</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Trajanje pregleda</span>
                        </Col>
                        <Col lg="2" className="actions">
                            <span className="name">Tip pregleda</span>
                        </Col>
                        <Col lg="2" className="actions">
                            <span className="name">Sala</span>
                        </Col>
                        <Col lg="3" className="actions">
                            <span className="name">Doktor</span>
                        </Col>

                    </Row>
                    {/* {
                        this.state.items.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>
                                    <Col lg="4">
                                        <span className="value">{item.tag}</span>
                                    </Col>
                                    <Col lg="4">
                                        <span className="value">{item.name}</span>
                                    </Col>

                                    <Col lg="4" className="actions">
                                        <Link to={`/clinic/types/${item._id}`}><Isvg src={editIcon} /></Link>
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
                            <Link to={`/clinic/appointments/new`}>
                                <button>Novi termin</button>
                            </Link>
                        </Col>
                    </Row>

                </Container>

            </div>
        )
    }
}

export default Page(Appointments);