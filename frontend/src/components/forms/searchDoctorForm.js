import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import Date from './fields/date_time';

import Text from './fields/text';
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
                                <Col lg="4" className="input-wrap">
                                    <Field
                                        name="doctorName"
                                        component={renderTextField}
                                        placeholder='Unesite ime doktora'
                                    ></Field>
                                </Col>
                                <Col lg="4" className="input-wrap">
                                    <Field
                                        name="doctorLastName"
                                        component={renderTextField}
                                        placeholder='Unesite prezime doktora'
                                    ></Field>
                                </Col>
                                <Col lg="4" className="input-wrap">
                                    <Field
                                        name="doctorRating"
                                        component={renderTextField}
                                        placeholder='Unesite minimalnu ocijenu'
                                    ></Field>
                                </Col>
                                <Col lg="4" className="input-wrap">
                                    <Field
                                        name="doctorType"
                                        component={renderSelectField}
                                        label={"Tip pregleda"}
                                        placeholder="Izaberite tip pregleda"

                                    >
                                        {/* <option value="tip1">tip1</option>
                                        <option value="tip2">tip2</option> */}
                                        {this.props.types && this.props.types.map((item, idx) => {
                                            return (
                                                <option value={item.tag}>{item.tag}</option>
                                            )
                                        })}

                                    </Field>
                                </Col>
                                <Col lg="4" className="input-wrap">
                                    <Field
                                        name="date"
                                        component={renderDateField}
                                        label={"Datum i vrijeme pregleda"}
                                        placeholder="Izaberite datum"
                                    >
                                    </Field>
                                </Col>
                                
                                <Col lg="12">
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