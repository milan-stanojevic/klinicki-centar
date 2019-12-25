import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';
import moment from 'moment';

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
        let ts = Math.floor(data.date.getTime() / 1000)
        let date = moment.unix(ts).format('DD.MM.YYYY')
        let obj = {
            username: data.username,
            // date: date,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            image: data.image,
            pol: data.pol,
            email: data.email,
            adress: data.adress
        }

        fetch('http://127.0.0.1:4000/clinic/user/update', {
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
        fetch('http://127.0.0.1:4000/clinic/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicUserToken')}`

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
                    !localStorage.clinicUserToken ? <Redirect to='/login' /> : null
                
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