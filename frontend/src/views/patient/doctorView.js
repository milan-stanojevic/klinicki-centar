import React, { Component } from 'react'
import Page from '../../containers/admin/page';
import { Link, Redirect } from 'react-router-dom';

import {
    Container,
    Row,
    Col,
} from 'reactstrap';


class DoctorView extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        // this.delete = this.delete.bind(this);
        // this.search = this.search.bind(this);
        this.reserve = this.reserve.bind(this);


        this.state = {
            items: []
        };
    }
    reserve(id, uid) {
        if (!localStorage.patientToken) {
            return;
        }

        this.setState({
            modal: uid
        })
        let obj = {}

        fetch('http://127.0.0.1:4000/patient/appointmentRequests/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`

            },
            body: JSON.stringify(obj)
        }).then((res) => this.get())
    }


    componentDidMount() {
        this.get();
    }

    get() {
        if (!localStorage.patientToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/patient/clinic/appointements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
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
                    !localStorage.patientToken ? <Redirect to='/login' /> : null
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
                        <Col lg="2">
                            <span className="name">Datum</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Trajanje</span>
                        </Col>
                        <Col lg="1">
                            <span className="name">Tip</span>
                        </Col>
                        <Col lg="1">
                            <span className="name">Sala</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Doktor</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Cijena</span>
                        </Col>
                        <Col lg="2" className="actions">
                            <span className="name">OPCIJE</span>
                        </Col>

                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            if(!item.verified && item.predef)
                            return (
                                
                                
                                <Row className="table-row" key={idx}>
                                    <Col lg="2">
                                        <span className="value">{item.date}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.duration}</span>
                                    </Col>
                                    <Col lg="1">
                                        <span className="value">{item.type}</span>
                                    </Col>
                                    <Col lg="1">
                                        <span className="value">{item.ordination}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.doctor}</span>
                                    </Col>
                                    <Col lg="2">
                                        <span className="value">{item.price}</span>
                                    </Col>
                                    <Col lg="2" className="actions">
                                        {item.actionCreated ?
                                                <button className="button1">OBRADA</button>
                                                :
                                                <button className="button" onClick={() => { this.reserve(item._id, item.uid) }}>ZAKAZI</button>
                                        }
                                    </Col>
                                </Row>
                            )
                        })
                    }

                </Container>



            </div>
        )
    }
}

export default Page(DoctorView)
