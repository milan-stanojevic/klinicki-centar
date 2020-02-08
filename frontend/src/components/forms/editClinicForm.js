import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import Isvg from 'react-inlinesvg';
import Calendar from 'react-calendar'


import Text from './fields/text';
import Image from './fields/image';
import TextArea from './fields/textarea';
import Select from './fields/select';
import MultiSelect from './fields/multiSelect';
import Map from './fields/map';

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
    label,
    meta: { touched, error },
    children
}) => (

        <MultiSelect
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            error={touched && error}
            {...input}
        >
            {children}
        </MultiSelect>
    )


const renderMapField = ({
    input,
    placeholder,
    label,
    meta: { touched, error },
    
}) => (

        <Map
            label={label}
            {...input}
        />
    )


class form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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
                                    <h3 className="title">Klinika</h3>
                                    <h6 className="subtitle">Unesite potrebne informacije za kliniku</h6>

                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="name"
                                        component={renderTextField}
                                        label={"Naziv klinike"}
                                        placeholder="Unesite naziv klinike"
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
                                    >
                                        {this.props.doctors && this.props.doctors.map((item, idx) => {
                                            return (
                                                <option value={item._id}>{item.firstName} {item.lastName}</option>
                                            )
                                        })}
                                    </Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="examination-room"
                                        component={renderMultiSelect}
                                        label={"Spisak sala"}
                                        placeholder="Izaberite sale"
                                    >
                                        {this.props.ordinations && this.props.ordinations.map((item, idx) => {
                                            return (
                                                <option value={item._id}>{item.tag}</option>
                                            )
                                        })}
                                    </Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <label>Slobodni termini pregleda</label>
                                    <Calendar
                                        name="appointment"
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
                                    ></Field>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="coords"
                                        component={renderMapField}
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