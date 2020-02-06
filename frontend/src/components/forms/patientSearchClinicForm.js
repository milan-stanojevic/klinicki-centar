import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import Text from './fields/text';

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
    id
}) => (

        <Text
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            error={touched && error}
            id={id}
            {...input}
        />
    )


class form extends React.Component {
    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        console.log(this.props);
        return (
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col lg="12" >
                        <Container fluid className="form-box">
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="search"
                                        component={renderTextField}
                                        placeholder= 'Unesite naziv klinike'
                                        id="search-clinic-name"
                                    ></Field>
                                </Col>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="adress"
                                        component={renderTextField}
                                        placeholder= 'Unesite adresu klinike'
                                    ></Field>
                                </Col>
                                <Col lg="6">
                                    <button id="search-clinic-button" className="button">Trazi</button>
                                </Col>
                            </Row>

                        </Container>
                    </Col>
                </Row>

            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)