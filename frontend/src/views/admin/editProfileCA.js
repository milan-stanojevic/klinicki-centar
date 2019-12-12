import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Page from '../../containers/admin/page';
import moment from 'moment';
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
        let ts = Math.floor(data.datum.getTime() / 1000)
        let date = moment.unix(ts).format('DD.MM.YYYY')
        let obj = {
            username: data.username,
            date: date,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            image: data.image,
            pol: data.pol,
            email: data.email,
            adress: data.adress
        }

        fetch('http://127.0.0.1:4000/clinic/admin/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
            },
            body: JSON.stringify(obj)
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
                </Container>


            </div>
        );
    }
}

export default Page(EditProfileCA);
