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

class Types extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        this.delete = this.delete.bind(this);

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
            method: 'GET',
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

    delete(id) {
        if (!localStorage.clinicAdminToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/clinic/types/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

            },
        }).then((res) => this.get())
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
                            <h3>Lista tipova pregleda</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <SearchForm />
                        </Col>
                    </Row>
                    <Row className="table-head">
                        <Col lg="4">
                            <span className="name">Oznaka</span>
                        </Col>
                        <Col lg="4">
                            <span className="name">Naziv</span>
                        </Col>

                        <Col lg="4" className="actions">

                            <span className="name">OPCIJE</span>
                        </Col>

                    </Row>
                    {
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
                                        <Link to={`/clinic/users/${item._id}`}><Isvg src={editIcon} /></Link>
                                        <button onClick={() => this.delete(item._id)}><Isvg src={deleteIcon} /></button>
                                    </Col>
                                </Row>
                            )
                        })
                    }

                </Container>

                <Container fluid className="bottom-wrap">
                    <Row>
                        <Col lg="12">
                            <Link to={`/clinic/types/new`}>
                                <button>Novi tip pregleda</button>
                            </Link>
                        </Col>
                    </Row>

                </Container>

            </div>
        )
    }
}

export default Page(Types);