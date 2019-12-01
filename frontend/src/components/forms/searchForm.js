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
}) => (

        <Text
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            error={touched && error}
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
                                        placeholder= 'Trazi . . . '
                                    ></Field>
                                </Col>
                                <Col lg="6">
                                    <button className="button">Trazi</button>
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