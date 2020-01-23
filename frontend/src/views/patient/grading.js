import React, { Component } from 'react'
import Page from '../../containers/admin/page';
import { Link, Redirect } from 'react-router-dom';

import GradingForm from '../../components/forms/gradingForm';


import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class Grading extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        this.add = this.add.bind(this);
        this.state = {
            items: []
        };
    }

    componentDidMount() {

        this.get();

    }
    add(data) { 
        console.log(data);
        fetch('http://127.0.0.1:4000/patient/clinic/rating' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((result) => {
            if (result.error) {
                this.setState({
                    error: result.error
                })
                return;
            }
            this.props[0].history.push('/patient/clinic/history')
        })
    }

    get() {
        if (!localStorage.patientToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/patient/clinic/grading', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`

            }
        }).then((res) => res.json()).then((result) => {
            this.setState({
                clinics: result
            })
            console.log(result);
        })
    }
    render() {
        return (
            <div>
                <Container fluid>
                {
                    !localStorage.patientToken ? <Redirect to='/login' /> : null
                }
                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Oceni kliniku</h3>
                        </Col>
                    </Row>
                    {this.state.initialValues ?
                        <GradingForm clinics={this.state.clinics} initialValues={this.state.initialValues} onSubmit={this.add} />
                        :
                        <GradingForm clinics={this.state.clinics} onSubmit={this.add} />
                    }
                    {
                        this.state.error ?

                            <p>{this.state.error}</p>
                            :
                            null
                    }
                </Container>
            </div>
        )
    }
}

export default Page(Grading)
