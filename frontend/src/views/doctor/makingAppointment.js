import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Page from '../../containers/admin/page';
import MakingAppointmentForm from '../../components/forms/makingAppointmentForm'
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


class MakingAppointment extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.state = {

        };
    }
    add(data) {
        console.log(data);
        let ts = Math.floor(data.date.getTime() / 1000)
        let date = moment.unix(ts).format('DD.MM.YYYY, HH:mm')
        let obj = {
            duration: data.duration,
            date: date,
            type: data.type,
            ordination: data.ordination,
            doctor: data.doctor,
            price: data.price
        }

        fetch('http://127.0.0.1:4000/doctor/makingAppointment/' + this.props[0].match.params.id, {
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
        fetch('http://127.0.0.1:4000/clinic/doctors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`

            }
        }).then((res) => res.json()).then((result) => {
            this.setState({
                doctors: result
            })
            console.log(result);
        })
        fetch('http://127.0.0.1:4000/clinic/type', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`

            }
        }).then((res) => res.json()).then((result) => {
            this.setState({
                types: result
            })
            console.log(result);
        })
        fetch('http://127.0.0.1:4000/clinic/ordination', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`

            }
        }).then((res) => res.json()).then((result) => {
            this.setState({
                ordinations: result
            })
            console.log(result);
        })
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
                            Dodaj novi pregled ili operaciju
                        </Col>
                    </Row>
                   
                        <MakingAppointmentForm doctors={this.state.doctors} types={this.state.types} ordinations={this.state.ordinations} onSubmit={this.add} />
                  
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

export default Page(MakingAppointment)
