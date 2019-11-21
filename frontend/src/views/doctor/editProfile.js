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

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.state = {

        };
    }

    add(data) {
        console.log(data);

        fetch('http://127.0.0.1:4000/admin/clinic/' + this.props[0].match.params.id, {
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
            this.props[0].history.push('/admin/clinic')
        })
    }

    componentDidMount() {
        if (this.props[0].match.params.id != 'new') {
            fetch('http://127.0.0.1:4000/admin/clinic/' + this.props[0].match.params.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`

                }
            }).then((res) => res.json()).then((result) => {
                this.setState({
                    initialValues: result
                })
                console.log(result);
            })

        }
    }


    render() {
        return (
            <div className="page-wrap">
                {
                   // !localStorage.token ? <Redirect to='/admin/login' /> : null
                
                }

                <Container fluid>

                    <Row className="page-title">
                        <Col lg="12">
                             <h3>Moj profil</h3>
                        </Col>
                    </Row>
                    {this.state.initialValues ?
                        <MedicalStaff initialValues={this.state.initialValues} onSubmit={this.add} /> //ClinicForm
                        :
                        <MedicalStaff onSubmit={this.add} />
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

export default Page(EditProfile);