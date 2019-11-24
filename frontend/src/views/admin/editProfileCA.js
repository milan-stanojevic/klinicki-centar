import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Page from '../../containers/admin/page';

import ClinicAdminProfile from '../../components/forms/clinicAdminProfile';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class EditProfileCA extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.state = {

        };
    }

    add(data) {
        console.log(data);

        fetch('http://127.0.0.1:4000/clinic/admin/update', {
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
            // this.props[0].history.push('/clinic/users')
        })
    }

    componentDidMount() {
        fetch('http://127.0.0.1:4000/clinic/admin/update', {
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
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null
                
                }
                <Container fluid>
                    <Row className="page-title">
                        <Col lg="12">
                            <h3>Moj profil</h3>
                        </Col>
                    </Row>
                    {this.state.initialValues ?
                        <ClinicAdminProfile initialValues={this.state.initialValues} onSubmit={this.add} /> 
                        :
                        <ClinicAdminProfile onSubmit={this.add} />
                    }
                    {
                        this.state.error ?

                            <p>{this.state.error}</p>
                            :
                            null
                    }
                    {/* <ClinicAdminProfile></ClinicAdminProfile> */}

                </Container>


            </div>
        );
    }
}

export default Page(EditProfileCA);
