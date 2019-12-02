import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Page from '../../containers/admin/page'
import Select from '../../components/forms/fields/select'
import SearchForm from '../../components/forms/searchPatientsForm'
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
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        this.search = this.search.bind(this);
        this.state = {
            items: [],
            sort: 0
        };
    }

    componentDidMount() {
        this.get();
    }

    get() {
        if (!localStorage.clinicUserToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/clinic/patients/' + this.state.sort, {
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
    search(data) {
        if (!localStorage.clinicUserToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/clinic/patientsSearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`
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
                    !localStorage.clinicUserToken ? <Redirect to='/login' /> : null

                }


                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="8">
                            <h3>Lista pacijenata</h3>
                        </Col>
                        <Col lg="4">
                            <Select placeholder="Sortiraj po" onChange={(val) => this.setState({ sort: val }, this.get)} value={this.state.sort}>
                                <option value={0}>Po imenu</option>
                                <option value={1}>Po jedinstvenom broju</option>
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <SearchForm onSubmit={this.search} />
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
                    {
                        this.state.items.map((item, idx) => {
                            return (
                                <Link to="/doctor/patient">
                                    <Row className="table-row" key={idx}>
                                        <Col lg="3">
                                            <span className="value">{item.firstName}</span>
                                        </Col>
                                        <Col lg="3">
                                            <span className="value">{item.lastName}</span>
                                        </Col>
                                        <Col lg="3">
                                            {/*<span className="value">{item.date}</span>*/}
                                        </Col>
                                        <Col lg="3" className="actions">
                                            {/*<Link to={`/admin/clinic/${item._id}`}><Isvg src={editIcon} /></Link>
                                            <Link to={`/admin/clinic/${item._id}/admins`}><Isvg src={adminIcon} /></Link>

                                            <button onClick={() => this.delete(item._id)}><Isvg src={deleteIcon} /></button>
                                */}
                                        </Col>
                                    </Row>
                                </Link>
                            )
                        })
                    }

                </Container>
            </div>
        )
    }
}

export default Page(patientsList)
