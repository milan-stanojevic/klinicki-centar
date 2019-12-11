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

        };
    }

    componentDidMount() {

    }

    renderEvent({ event }) {
        return (
            <>
                <p className={event.type == 0 ? 'operation-range' : 'examination-range'}>
                    <strong>{event.type == 0 ? 'Operacija' : 'Pregled'}</strong>
                </p>
                <p>
                    Pacijent: {event.patientName}
                </p>
                <p>
                    Doktor: {event.medicalStaff}
                </p>

            </>
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
                                events={[
                                    {
                                        id: 0,
                                        patientName: 'Pero Peric',
                                        medicalStaff: 'Dr. Jankovic, Sestra Jelena',
                                        start: new Date(2019, 11, 11, 3, 0, 0),
                                        end: new Date(2019, 11, 11, 4, 30, 0),
                                        type: 0,
                                    },
                                    {
                                        id: 1,
                                        patientName: 'Pero Peric',
                                        medicalStaff: 'Dr. Jankovic, Sestra Jelena',
                                        start: new Date(2019, 11, 11, 5, 20, 0),
                                        end: new Date(2019, 11, 11, 10, 30, 0),
                                        type: 1
                                    },


                                ]}
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