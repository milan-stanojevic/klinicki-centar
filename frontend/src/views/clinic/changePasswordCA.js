import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';


import logo from '../../assets/images/logo.png';
import bg from '../../assets/images/login-bg.png';
import ChangePasswordForm from '../../components/forms/newPasswordForm';


import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class ChangePasswordCA extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);

        this.state = {

        };
    }

    login(data) {


        fetch('http://127.0.0.1:4000/clinic/changePasswordCA', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
            },
            body: JSON.stringify({
                password: data.password
            })
        }).then((res) => res.json()).then((result) => {
            if (!result.error) {
                this.props[0].history.push('/clinic/users');
            } else {
                this.setState({
                    error: result.error
                })
            }
        })

    }



    render() {

        return (
            <div className="login-page">

                <Container className="block-wrap">
                    <Row>
                        {/* <Col lg="12">
                            <div className="logo">
                                <img src={logo} />
                                <h2>React<span>Admin</span></h2>
                            </div>
                        </Col> */}
                        <Col lg="12">
                            <Container>
                                <Row className="login-container">
                                    <Col lg="6" xs="12" className="login-bg">
                                        <img src={bg} />
                                    </Col>
                                    <Col lg="6" xs="12" className="login-form">
                                        <Container>
                                            <Row>
                                                <Col lg="12">
                                                    <h3>Prijava</h3>
                                                    <h6>Prva prijava, unesite novu lozinku!</h6>
                                                </Col>
                                            </Row>
                                            <ChangePasswordForm onSubmit={this.login} />
                                            {
                                                this.state.error ?
                                                    <p>{this.state.error}</p>
                                                    :
                                                    null
                                            }


                                        </Container>

                                    </Col>

                                </Row>
                            </Container>
                        </Col>
                    </Row>

                </Container>



            </div >
        );
    }
}

export default ChangePasswordCA;