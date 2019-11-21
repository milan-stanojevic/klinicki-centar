import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';


import logo from '../../assets/images/logo.png';
import bg from '../../assets/images/login-bg.png';
import RegisterForm from '../../components/forms/patientRegisterForm';


import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class Register extends Component {
    constructor(props) {
        super(props);
        this.register = this.register.bind(this);

        this.state = {

        };
    }

    register(data) {

        fetch('http://127.0.0.1:4000/patient/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((result) => {
            if (!result.error) {
                this.props[0].history.push('/patient/login');
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
                {
                    localStorage.patientToken ? <Redirect to='/patient' /> : null
                }

                <Container className="block-wrap">
                    <Row>
                        <Col lg="12">
                            <div className="logo">
                                <img src={logo} />
                                <h2>React<span>Admin</span></h2>
                            </div>
                        </Col>
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
                                                    <h3>Registracija pacijenta</h3>
                                                    <h6>Hello there! Sign in and start managing your website</h6>
                                                </Col>
                                            </Row>
                                            <RegisterForm onSubmit={this.register} />
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

export default Register;