import React, { Component } from 'react'

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
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const localizer = momentLocalizer(moment)




class CompletedExaminations extends Component {
    constructor(props) {
        super(props);
        this.renderEvent = this.renderEvent.bind(this);

        this.state = {
            events: [],
            initialValues: [[],[]]
        };
    }


    componentDidMount() {
        fetch('http://127.0.0.1:4000/clinic/completedEvents', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

            }
        }).then((res) => res.json()).then((result) => {
            // for (let i = 0; i < result.length; i++) {
            //     //result[i].start =  new Date(result[i].start * 1000);
            //     //result[i].end =  new Date(result[i].end * 1000);
            //     result[i].start = moment(result[i].appointment.date, 'DD.MM.YYYY, HH:mm').toDate();
            //     result[i].end = moment(result[i].appointment.date, 'DD.MM.YYYY, HH:mm').add(result[i].appointment.duration, 'minutes').toDate();

            // }
            // this.setState({ events: result })
            this.setState({
                initialValues: result
            })
            console.log(result);
        })

    }

    renderEvent({ event }) {
        return (
            <div>
                <p className={event.type == 0 ? 'operation-range' : 'examination-range'}>
                    <strong>{event.typeTag}</strong>
                </p>
                <p>
                    Pacijent: {event.patient.firstName} {event.patient.lastName}
                </p>
                <p>
                    Doktor: {event.docName}
                </p>
                <p>
                    Sala: {event.ordinationTag}
                </p>

            </div>
        )
    }


    render() {
        const options = {
            title: {
                text: "NA DNEVNOM NIVOU"
            },
            animationEnabled: true,
            data: [
                {
                    // Change type to "doughnut", "line", "splineArea", etc.
                    type: "column",
                    dataPoints: [
                        

                    ]
                }
            ]

        }
        for(let i = 0; i<this.state.initialValues[0].length; i++)
        {
            options.data[0].dataPoints.push({label: this.state.initialValues[0][i], y : parseInt(this.state.initialValues[1][i])})
        }
        const options1 = {
            title: {
                text: "NA NEDELJNOM NIVOU"
            },
            animationEnabled: true,
            data: [
                {
                    // Change type to "doughnut", "line", "splineArea", etc.
                    type: "doughnut",
                    dataPoints: [

                    ]
                }
            ]
        }
        for(let i = 0; i<this.state.initialValues[0].length; i++)
        {
            options1.data[0].dataPoints.push({label: this.state.initialValues[0][i], y : parseInt(this.state.initialValues[1][i])})
        }
        const options2 = {
            title: {
                text: "NA MJESECNOM NIVOU"
            },
            animationEnabled: true,
            data: [
                {
                    // Change type to "doughnut", "line", "splineArea", etc.
                    type: "splineArea",
                    dataPoints: [
                       

                    ]
                }
            ]
        }
        for(let i = 0; i<this.state.initialValues[0].length; i++)
        {
            options2.data[0].dataPoints.push({label: this.state.initialValues[0][i], y : parseInt(this.state.initialValues[1][i])})
        }
        return (
            // <div className="page-wrap">
            //     {
            //         !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null

            //     }
            //     <Container fluid>
            //         <Row className="page-title">
            //             <Col lg="12">
            //                 <h3>Grafik</h3>
            //             </Col>
            //             <Col lg="12">

            //             </Col>

            //         </Row>
            //     </Container>

            // </div>
            <div className="page-wrap">
                {
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null

                }
                <Container fluid>

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Graficki prikaz odrzanih pregleda</h3>
                        </Col>
                        
                        <Col lg="12">
                            <CanvasJSChart options={options}></CanvasJSChart>
                        </Col>
                        <Col lg="6">
                            <CanvasJSChart options={options1}></CanvasJSChart>
                        </Col>
                        <Col lg="6">
                            <CanvasJSChart options={options2}></CanvasJSChart>
                        </Col>




                    </Row>

                </Container>

            </div>
        )
        // return (
        //     <div className="page-wrap">
        //         {
        //             !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null

        //         }

        //         <Container fluid>

        //             <Row className="page-title">
        //                 <Col lg="12">
        //                     <h3>Radni kalendar</h3>
        //                 </Col>
        //                 <Col lg="12">
        //                     <Calendar
        //                         localizer={localizer}
        //                         components={{
        //                             event: this.renderEvent,

        //                         }}
        //                         events={this.state.events}
        //                         startAccessor="start"
        //                         endAccessor="end"
        //                         style={{ height: 870 }}
        //                     />

        //                 </Col>

        //             </Row>

        //         </Container>


        //     </div>
        // )

    }
}

export default Page(CompletedExaminations)
