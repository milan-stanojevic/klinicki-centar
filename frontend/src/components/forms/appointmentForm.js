import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import Isvg from 'react-inlinesvg';

import Text from './fields/text';
import Image from './fields/image';
import Select from './fields/select';
import Date from './fields/date_time';

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
    id
}) => (

        <Text
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            error={touched && error}
            {...input}
            id={id}
        />
    )
const renderDateField = ({
    input,
    placeholder,
    label,
    type,
    meta: { touched, error },
    id
}) => (
        <Date
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            type={type}
            error={touched && error}
            {...input}
            id={id}
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
    children,
    id
}) => (

        <Select
            placeholder={placeholder}
            label={label}
            errorText={touched && error}
            error={touched && error}
            {...input}
            id={id}
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
                                        name="date"
                                        component={renderDateField}
                                        label={"Datum i vrijeme pregleda"}
                                        placeholder="Izaberite datum"
                                        validate={[required]}
                                        id="date"
                                    >
                                    </Field>
                                </Col>
                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="duration"
                                        component={renderTextField}
                                        label={"Trajanje pregleda"}
                                        placeholder="Unesite dužinu trajanja pregleda"
                                        validate={[required]}
                                        id="duration"
                                    ></Field>
                                </Col>

                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="type"
                                        component={renderSelectField}
                                        label={"Tip pregleda"}
                                        placeholder="Izaberite tip pregleda"
                                        validate={[required]}
                                        id="type"

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

                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="ordination"
                                        component={renderSelectField}
                                        label={"Sala"}
                                        placeholder="Izaberite salu za pregled"
                                        validate={[required]}
                                        id="ordination"
                                    >
                                        {this.props.ordinations && this.props.ordinations.map((item, idx) => {
                                            return (
                                                <option value={item.tag}>{item.tag}</option>
                                            )
                                        })}

                                    </Field>
                                </Col>
                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="doctor"
                                        component={renderSelectField}
                                        label={"Doktor"}
                                        placeholder="Izaberite doktora"
                                        validate={[required]}
                                        id="doctor"
                                    >
                                        {/* <option value="Petar Petrovic">Petar Petrovic</option> */}
                                        {/* <option value="Ivan Ivanic">Ivan Ivanic</option> */}
                                        {this.props.doctors && this.props.doctors.map((item, idx) => {
                                            return (
                                                <option value={item.firstName + " " + item.lastName}>{item.firstName} {item.lastName}</option>
                                            )
                                        })}

                                    </Field>
                                </Col>
                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="price"
                                        component={renderTextField}
                                        label={"Cijena pregleda"}
                                        placeholder="Unesite cijenu pregleda"
                                        validate={[required]}
                                        id="price"
                                    ></Field>
                                </Col>



                            </Row>
                        </Container>
                    </Col>

                    <Col lg="12">
                        <button className="button" id="create-appointment-button">Dodaj</button>

                    </Col>

                </Row>

            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)
