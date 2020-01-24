import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import MedicalStaff from '../../components/forms/medicalStaff';




import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';
import VacationForm from '../../components/forms/vacationForm';
import moment from 'moment'

class Vacation extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.state = {

        };
    }

    add(data) {
        console.log(data);
        let ts = Math.floor(data.date.getTime() / 1000)
        console.log(ts);
        let date = moment.unix(ts).format('DD.MM.YYYY')
        let obj = {
            duration: data.duration,
            date: date,
            reason: data.reason
        }
        fetch('http://127.0.0.1:4000/clinic/vacationRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`
            },
            body: JSON.stringify(obj)
        }).then((res) => res.json()).then((result) => {
            if (result.error) {
                this.setState({
                    error: result.error
                })
                return;
            }
            this.props[0].history.push('/doctor')
        })
    }

    componentDidMount() {

    }


    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicUserToken ? <Redirect to='/login' /> : null
                
                }

                <Container fluid>

                    <Row className="page-title">
                        <Col lg="12">
                             <h3>Godišnji odmor ili odsustvo</h3>
                        </Col>
                    </Row>
                    {this.state.initialValues ?
                        <VacationForm initialValues={this.state.initialValues} onSubmit={this.add} /> //ClinicForm
                        :
                        <VacationForm onSubmit={this.add} />
                    }
                    {
                        this.state.error ?

                            <p>{this.state.error}</p>
                            :
                            null
                    }
                </Container>


            </div>
        );
    }
}

export default Page(Vacation);