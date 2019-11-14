import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import Isvg from 'react-inlinesvg';
import Calendar from 'react-calendar'


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
    { label: 'Thing 1', value: 1 },
    { label: 'Thing 2', value: 2 },
];

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
                                    <h3 className="title">Klinika</h3>
                                    <h6 className="subtitle">Unesite potrebne informacije za kliniku</h6>

                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="name"
                                        component={renderTextField}
                                        label={"Ime klinike"}
                                        placeholder="Unesite ime klinike"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="adress"
                                        component={renderTextField}
                                        label={"Adresa klinike"}
                                        placeholder="Unesite adresa klinike"
                                        validate={[required]}
                                    >

                                    </Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="description"
                                        component={renderTextArea}
                                        label={"Opis klinike"}
                                        placeholder="Unesite opis klinike"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="doctors-list"
                                        component={renderMultiSelect}
                                        label={"Spisak lekara"}
                                        placeholder="Izaberite lekare"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="examination-room"
                                        component={renderMultiSelect}
                                        label={"Spisak sala"}
                                        placeholder="Izaberite sale"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <label>Slobodni termini pregleda</label>
                                    <Calendar
                                        name="appointment"
                                        validate={[required]}
                                    />

                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="price-list"
                                        component={renderTextArea}
                                        label={"Cenovnik"}
                                        placeholder="Unesite cenovnik"
                                        validate={[required]}
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