import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import editIcon from '../../assets/svg/edit.svg';
import deleteIcon from '../../assets/svg/delete.svg';
import SearchForm from '../../components/forms/searchOrdinationForm';
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

class Ordinations extends Component {
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

        fetch('http://127.0.0.1:4000/clinic/ordinations', {
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
        let date;
        try {
            let ts = Math.floor(data.date.getTime() / 1000)
            date = moment.unix(ts).format('DD.MM.YYYY')
        }
        catch (e) { }

        let obj = {
            tag: data.tag,
            name: data.name,
            date: date
        }
        fetch('http://127.0.0.1:4000/clinic/ordinations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
            },
            body: JSON.stringify(obj),
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

        fetch('http://127.0.0.1:4000/clinic/ordinations/' + id, {
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
                            <h3>Lista sala</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <SearchForm onSubmit={this.search} />
                        </Col>
                    </Row>
                    <Row className="table-head">
                        <Col lg="3">
                            <span className="name">Oznaka</span>
                        </Col>
                        <Col lg="6">
                            <span className="name">Naziv</span>
                        </Col>


                        <Col lg="3" className="actions">

                            <span className="name">OPCIJE</span>
                        </Col>

                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            return (

                                <Row className="table-row" key={idx}>
                                    <Col lg="3">
                                        <span className="value">{item.tag}</span>
                                    </Col>
                                    <Col lg="6">
                                        <span className="value">{item.name}</span>
                                    </Col>


                                    <Col lg="3" className="actions">
                                        {!item.reserved ?
                                            <>
                                                <Link to={`/clinic/ordination/${item._id}`}><Isvg src={editIcon} /></Link>
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
