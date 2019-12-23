import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';
import 'react-big-calendar/lib/sass/styles.scss';

import { Calendar, momentLocalizer } from 'react-big-calendar'

import moment from 'moment'
const localizer = momentLocalizer(moment)

class CalendarPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        };
    }

    componentDidMount() {
        fetch('http://127.0.0.1:4000/clinic/events', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`

            }
        }).then((res) => res.json()).then((result) => {
            for(let i=0;i<result.length;i++){
                //result[i].start =  new Date(result[i].start * 1000);
                //result[i].end =  new Date(result[i].end * 1000);
                result[i].start = moment(result[i].appointment.date, 'DD.MM.YYYY, HH:mm').toDate();
                result[i].end = moment(result[i].appointment.date, 'DD.MM.YYYY, HH:mm').add(result[i].appointment.duration, 'minutes').toDate();

            }
            this.setState({events: result})
            console.log(result);
        })

    }

    renderEvent({ event }) {
        return (
            <div onClick={() => alert(true)}>
                <p className={event.type == 0 ? 'operation-range' : 'examination-range'}>
                    <strong>{event.appointment.type}</strong>
                </p>
                <p>
                    Pacijent: {event.patient.firstName} {event.patient.lastName}
                </p>
                <p>
                    Doktor: {event.appointment.doctor}
                </p>
                <p>
                    Sala: {event.appointment.ordination}
                </p>

            </div>
        )
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
                            <h3>Radni kalendar</h3>
                        </Col>
                        <Col lg="12">
                            <Calendar
                                localizer={localizer}
                                components={{
                                    event: this.renderEvent,

                                }}
                                events={this.state.events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 870 }}
                            />

                        </Col>

                    </Row>

                </Container>


            </div>
        );
    }
}

export default Page(CalendarPage);