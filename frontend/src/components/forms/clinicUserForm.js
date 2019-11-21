import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import Isvg from 'react-inlinesvg';

import Text from './fields/text';
import Image from './fields/image';
import Select from './fields/select';

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

const renderSelectField = ({
    input,
    placeholder,
    label,
    meta: { touched, error },
    children
}) => (

        <Select
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            error={touched && error}
            {...input}
        >
            {children}
        </Select>
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
                                    <h3 className="title">Korisnik</h3>
                                    <h6 className="subtitle">Unesite potrebne informacije za korisnika</h6>

                                </Col>

                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="type"
                                        component={renderSelectField}
                                        label={"Tip korisnika"}
                                        placeholder="Izaberite tip"
                                        validate={[required]}
                                    >
                                        <option value="doctor">Doktor</option>
                                        <option value="nurse">Medecinska sestra</option>
                                    </Field>

                                </Col>

                                <Col lg="12">
                                </Col>


                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="username"
                                        component={renderTextField}
                                        label={"Korisnicko ime"}
                                        placeholder="Unesite korisnicko ime administratora"
                                        validate={[required]}
                                    ></Field>

                                </Col>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="password"
                                        component={renderTextField}
                                        label={"Nova lozinka"}
                                        placeholder="Popunite ovo polje samo ako zelite da kreirate novu lozinku"
                                    ></Field>

                                </Col>


                            </Row>
                        </Container>
                    </Col>

                    <Col lg="12">
                        <button className="button">Save</button>

                    </Col>

                </Row>

            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)
