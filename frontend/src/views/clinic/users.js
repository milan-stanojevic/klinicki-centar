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

class Users extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        this.delete = this.delete.bind(this);
        this.search = this.search.bind(this);

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
    search(data) {
        if (!localStorage.clinicAdminToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/clinic/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
            },
            body: JSON.stringify(data),
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

        fetch('http://127.0.0.1:4000/clinic/users/' + id, {
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
                            <h3>Lista korisnika klinike</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <SearchForm onSubmit={this.search} />
                        </Col>
                    </Row>
                    <Row className="table-head">
                        <Col lg="2">
                            <span className="name">KORISNICKO IME</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">TIP</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">IME</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">PREZIME</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">OCJENA</span>
                        </Col>

                        <Col lg="2" className="actions">

                            <span className="name">OBRISI</span>
                        </Col>

                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            return (
                                <Row className="table-row" key={idx}>
                                    <Col lg="2">
                                        <span className="value">{item.username}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.type}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.firstName}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.lastName}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">
                                            {item.avgRating}
                                        </span>
                                    </Col>

                                    <Col lg="2" className="actions">
                                        {!item.reserved ?
                                            <>
                                                <button onClick={() => this.delete(item._id)}><Isvg src={deleteIcon} /></button>
                                            </>
                                            :
                                            <>
                                                <button className='button1'>Rezervisano</button>
                                            </>
                                        }
                                    </Col>
                                </Row>
                            )
                        })
                    }

                </Container>

                <Container fluid className="bottom-wrap">
                    <Row>
                        <Col lg="12">
                            <Link to={`/clinic/users/new`}>
                                <button>Novi korisnik</button>
                            </Link>
                        </Col>
                    </Row>

                </Container>

            </div>
        );
    }
}

export default Page(Users);