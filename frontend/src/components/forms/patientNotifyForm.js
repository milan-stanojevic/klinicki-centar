import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import Text from './fields/text';
import TextArea from './fields/textarea';

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
    type,
    meta: { touched, error },
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

const renderTextArea = ({
    input,
    placeholder,
    label,
    meta: { touched, error },
}) => (

        <TextArea
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
        return (
            <form onSubmit={handleSubmit}>
                <Container fluid >
                    <Row>
                        <Col lg="12" className="input-wrap">
                            <Field
                                name="subject"
                                component={renderTextField}
                                label={"Naslov"}
                                placeholder="Unesite naslov"
                                validate={[required]}
                            ></Field>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="12" className="input-wrap">
                            <Field
                                name="message"
                                component={renderTextArea}
                                label={"Poruka"}
                                placeholder="Unesite poruku"
                            ></Field>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <button className="button">Pošalji</button>

                        </Col>

                    </Row>
                </Container>



            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)