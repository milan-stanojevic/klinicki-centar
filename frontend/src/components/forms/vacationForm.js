import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Text from './fields/text';
import Image from './fields/image';
import TextArea from './fields/textarea';
import Select from './fields/select';
import MultiSelect from './fields/multiSelect';

import Date from './fields/date1';

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
                                    <h3 className="title">Zahtjev za godšnji odmor ili odsustvo</h3>
                                </Col>
                            </Row>

                            
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="date"
                                        component={renderDateField}
                                        label={"Datum"}
                                        placeholder="Izaberite datum"
                                    >
                                    </Field>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="duration"
                                        component={renderTextField}
                                        label={"Trajanje odsustva u danima"}
                                        placeholder="Unesite trajanje odsustva"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="reason"
                                        component={renderTextArea}
                                        label={"Obrazloženje"}
                                        placeholder="Unesite obrazloženje"
                                        validate={[required]}
                                    ></Field>
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    <Col lg="12">
                        <button className="button">Pošalji</button>

                    </Col>

                </Row>

            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)