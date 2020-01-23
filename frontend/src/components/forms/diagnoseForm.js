import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import Isvg from 'react-inlinesvg';

import Text from './fields/text';
import TextArea from './fields/textarea';

import Image from './fields/image';

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

const renderImageField = ({
    input,
    placeholder,
    meta: { touched, error },
}) => (

        <Image
            placeholder={placeholder}
            errorText={touched && error}
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
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {

        const { handleSubmit, pristine, reset, submitting } = this.props;
        console.log(this.props);

        return (
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col lg="12" >
                        <Container fluid className="form-box">
                            <Row>
                                <Col lg="12">
                                    <h3 className="title">Dijagnoza</h3>
                                    <h6 className="subtitle">Unesite potrebne informacije za dijagnozu</h6>

                                </Col>
                                </Row>
                                <Row>
                                <Col lg="6"  className="input-wrap">
                                    <Field
                                        name="name"
                                        component={renderTextField}
                                        label={"Ime dijagnoze"}
                                        placeholder="Unesite ime dijagnoze"
                                        validate={[required]}
                                    ></Field>

                                </Col>
                                <Col lg="12"  className="input-wrap">
                                    <Field
                                        name="descriptiption"
                                        component={renderTextArea}
                                        label={"Opis"}
                                        placeholder="Unesite opis dijagnoze"
                                        validate={[required]}
                                    ></Field>

                                </Col>

                            </Row>
                        </Container>
                    </Col>

                    <Col lg="12">
                        <button className="button">Sačuvaj</button>

                    </Col>

                </Row>

            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)
