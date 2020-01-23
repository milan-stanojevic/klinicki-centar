import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import Isvg from 'react-inlinesvg';
import { Link } from 'react-router-dom';

import Text from './fields/text';
import Check from './fields/check';

import {
    Container,
    Row,
    Col,
} from 'reactstrap';

const required = value => value ? undefined : "Required"

const renderTextField = ({
    input,
    placeholder,
    label,
    meta: { touched, error },
    type
}) => (

        <Text
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            type={type}
            error={touched && error}
            {...input}
        />
    )


const renderCheckField = ({
    input,
    label,
    meta: { touched, error },
}) => (

        <Check
            label={label}
            errorText={touched && error}
            error={touched && error}
            {...input}
        />
    )



const form = (props) => {
    const { handleSubmit, pristine, reset, submitting } = props;
    console.log(pristine, submitting);

    return (

        <form onSubmit={handleSubmit}>
            <Row>
                <Col lg="12" className="input-wrap">
                    <Field
                        name="email"
                        component={renderTextField}
                        placeholder="E-mail"
                    ></Field>
                </Col>
                <Col lg="12" className="input-wrap">
                    <Field
                        name="firstName"
                        component={renderTextField}
                        placeholder="Ime"
                    ></Field>
                </Col>
                <Col lg="12" className="input-wrap">
                    <Field
                        name="lastName"
                        component={renderTextField}
                        placeholder="Prezime"
                    ></Field>
                </Col>
                <Col lg="12" className="input-wrap">
                    <Field
                        name="username"
                        component={renderTextField}
                        placeholder="Korisničko ime"
                    ></Field>
                </Col>
                <Col lg="12" className="input-wrap">
                    <Field
                        name="password"
                        component={renderTextField}
                        placeholder="Lozinka"
                        type="password"
                    ></Field>
                </Col>
                {/*<Col lg="6" xs="12" className="input-wrap">

                    <Field
                        name="remeber"
                        label="Remember me"
                        component={renderCheckField}

                    ></Field>

                </Col>
                <Col lg="6" xs="12" className="input-wrap forgot-password-wrap">
                    <Link to='/' className="forgot-password">Forgot Password?</Link>
                </Col>
                */
                }

                <Col lg="12">
                    <button>REGISTRUJ SE</button>
                </Col>
            </Row>
        </form>
    )
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)
