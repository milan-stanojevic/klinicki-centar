import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Text from './fields/text';
import Image from './fields/image';
import TextArea from './fields/textarea';
import Select from './fields/select';
import MultiSelect from './fields/multiSelect';


import {
    Container,
    Row,
    Col,
} from 'reactstrap';

const required = value => value ? undefined : "Required"

const options = [
    { label: 'Muski', value: 1 },
    { label: 'Zenski', value: 2 },
];

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
const renderSelectField = ({
    input,
    placeholder,
    label,
    meta: { touched, error },
}) => (

        <Select
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            error={touched && error}
            {...input}
        >
            <option value="1">Muski</option>
            <option value="2">Zenski</option>
        </Select>
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


const renderMultiSelect = ({
    input,
    placeholder,
    meta: { touched, error },
}) => (

        <MultiSelect
            placeholder={placeholder}
            errorText={touched && error}
            error={touched && error}
            {...input}
        >
        </MultiSelect>
    )

class form extends React.Component {
    state = {
        startDate: new Date()
    };

    handleChange = date => {
        this.setState({
            startDate: date
        });
    };
    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col lg="12" >
                        <Container fluid className="form-box">
                            <Row>
                                <Col lg="12">
                                    <h3 className="title">Profil medicinskog osoblja</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="username"
                                        component={renderTextField}
                                        label={"Korisnicko ime"}
                                        placeholder="Unesite korisnicko ime"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="old-password"
                                        component={renderTextField}
                                        label={"Trenutna lozinka"}
                                        placeholder="Unesite trenutnu lozinku"
                                        // validate={[required]}
                                        type="password"
                                    ></Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="new-password"
                                        component={renderTextField}
                                        label={"Nova lozinka"}
                                        placeholder="Unesite novu lozinku"
                                        // validate={[required]}
                                        type="password"
                                    ></Field>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="name"
                                        component={renderTextField}
                                        label={"Ime"}
                                        placeholder="Unesite ime"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="lastname"
                                        component={renderTextField}
                                        label={"Prezime"}
                                        placeholder="Unesite prezime"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="image"
                                        component={renderImageField}
                                    ></Field>

                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <label>Datum rodjenja</label>
                                    <br></br>
                                    <DatePicker
                                        selected={this.state.startDate}
                                        onChange={this.handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="pol"
                                        component={renderSelectField}
                                        label={"Pol"}
                                        placeholder="Izaberite pol"
                                    >
                                    </Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="email"
                                        component={renderTextField}
                                        label={"E-mail adresa"}
                                        placeholder="Unesite e-mail adresu"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="adress"
                                        component={renderTextField}
                                        label={"Adresa stanovanja"}
                                        placeholder="Unesite adresa stanovanja"
                                        validate={[required]}
                                    >
                                    </Field>
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    <Col lg="12">
                        <button className="button">Sacuvaj</button>

                    </Col>

                </Row>

            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)