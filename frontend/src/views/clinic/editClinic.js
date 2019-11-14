import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import ClinicForm from '../../components/forms/editClinicForm';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class Clinic extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.state = {

        };
    }

    add(data) {
        console.log(data);

        fetch('http://127.0.0.1:4000/clinic/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((result) => {
            if (result.error) {
                this.setState({
                    error: result.error
                })
                return;
            }
            //this.props[0].history.push('/admin/clinic')
        })
    }

    componentDidMount() {
            fetch('http://127.0.0.1:4000/clinic/data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

                }
            }).then((res) => res.json()).then((result) => {
                this.setState({
                    initialValues: result
                })
                console.log(result);
            })

        
    }


    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicAdminToken ? <Redirect to='/clinic/admin/login' /> : null
                
                }

                <Container fluid>

                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Izmjeni klinku</h3>
                        </Col>
                    </Row>
                    {this.state.initialValues ?
                        <ClinicForm initialValues={this.state.initialValues} onSubmit={this.add} />
                        :
                        <ClinicForm onSubmit={this.add} />
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

export default Page(Clinic);