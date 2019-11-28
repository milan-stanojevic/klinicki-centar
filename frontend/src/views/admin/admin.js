import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import ClinicAdminForm from '../../components/forms/clinicAdminForm';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.state = {

        };
    }

    add(data) {
        console.log(data);

        fetch('http://127.0.0.1:4000/admin/admins/update/' + this.props[0].match.params.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((result) => {
            if (result.error) {
                this.setState({
                    error: result.error
                })
                return;
            }
            this.props[0].history.push('/admin/admins')
        })
    }

    componentDidMount() {
    }


    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.token ? <Redirect to='/admin/login' /> : null
                }

                <Container fluid>

                    <Row className="page-title">
                        <Col lg="12">
                            {this.props[0].match.params.id !== 'new' ? <h3>Izmjeni administratora klinickog centra</h3> : <h3>Dodaj administratora klinickog centra</h3>}
                        </Col>
                    </Row>
                    {this.state.initialValues ?
                        <ClinicAdminForm initialValues={this.state.initialValues} onSubmit={this.add} />
                        :
                        <ClinicAdminForm onSubmit={this.add} />
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

export default Page(Admin);