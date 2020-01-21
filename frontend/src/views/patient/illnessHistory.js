import React, { Component } from 'react'
import Page from '../../containers/admin/page';
import { Link, Redirect } from 'react-router-dom';
import SearchForm from '../../components/forms/searchDoctorForm';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class IllnessHistory extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);

        this.state = {
            items: []
        };
    }

    componentDidMount() {

        this.get();

    }

    get() {
        if (!localStorage.patientToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/patient/clinic/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                items: result
            })
            console.log(result);
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
                            <h3>Lista svih pregleda</h3>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col lg="12">
                            <SearchForm types={this.state.types} onSubmit={this.search} />
                        </Col>
                    </Row> */}
                    <Row className="table-head">
                        
                        <Col lg="3">
                            <span className="name">Doktor</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Datum</span>
                        </Col>
                        <Col lg="3">
                            <span className="name">Dijagnoza</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Lekovi</span>
                        </Col>
                        <Col lg="2">
                            <span className="name">Izvestaj</span>
                        </Col>
                        
                        
                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            
                                return (
                                    // <Link to='/patient/clinic/doctors/id'>

                                        <Row className="table-row" key={idx}>
                                            <Col lg="3">
                                                <span className="value">{item.doctor}</span>
                                            </Col>
                                            <Col lg="2">
                                                <span className="value">{item.date}</span>
                                            </Col>
                                            <Col lg="3">
                                                <span className="value">{item.diagnose}</span>
                                            </Col>
                                            <Col lg="2">
                                                <span className="value">{item.medications}</span>
                                            </Col>
                                            <Col lg="2">
                                                <span className="value">{item.report}</span>
                                            </Col>
                                        </Row>
                                    // </Link>
                                )
                        })
                    }

                </Container>
            </div>
        );
    }
}

export default Page(IllnessHistory)
