import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import Isvg from 'react-inlinesvg';

import Text from './fields/text';
import Image from './fields/image';
import Select from './fields/select';
import Date from './fields/date';

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
const renderDateField = ({
    input,
    placeholder,
    label,
    type,
    meta: { touched, error },
}) => (
        <Date
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            type={type}
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

                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="datum"
                                        component={renderDateField}
                                        label={"Datum i vrijeme pregleda"}
                                        placeholder="Izaberite datum"
                                    >
                                    </Field>
                                </Col>
                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="duration"
                                        component={renderTextField}
                                        label={"Trajanje pregleda"}
                                        placeholder="Unesite duzinu trajanja pregleda"
                                        validate={[required]}
                                    ></Field>
                                </Col>

                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="type"
                                        component={renderSelectField}
                                        label={"Tip pregleda"}
                                        placeholder="Izaberite tip pregleda"
                                    >
                                        {/* <option value="1">Muski</option>
                                        <option value="2">Zenski</option> */}

                                    </Field>
                                </Col>

                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="ordination"
                                        component={renderSelectField}
                                        label={"Sala"}
                                        placeholder="Izaberite salu za pregled"
                                    >
                                        {/* <option value="1">Muski</option>
                                        <option value="2">Zenski</option> */}

                                    </Field>
                                </Col>
                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="doctor"
                                        component={renderSelectField}
                                        label={"Doktor"}
                                        placeholder="Izaberite doktora"
                                    >
                                        {/* <option value="1">Muski</option>
                                        <option value="2">Zenski</option> */}

                                    </Field>
                                </Col>
                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="price"
                                        component={renderTextField}
                                        label={"Cijena pregleda"}
                                        placeholder="Unesite cijenu pregleda"
                                        validate={[required]}
                                    ></Field>
                                </Col>



                            </Row>
                        </Container>
                    </Col>

                    <Col lg="12">
                        <button className="button">Dodaj</button>

                    </Col>

                </Row>

            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)
