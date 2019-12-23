import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import Isvg from 'react-inlinesvg';

import Text from './fields/text';
import Image from './fields/image';
import Select from './fields/select';
import Date from './fields/date_time';
import TextArea from './fields/textarea';
import MultiSelect from './fields/multiSelect';

import {
    Container,
    Row,
    Col,
} from 'reactstrap';

const required = value => value ? undefined : "Required"
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
                                        name="diagnose"
                                        component={renderSelectField}
                                        label={"Dijagnoza"}
                                        placeholder="Izaberite dijagnozu"
                                        validate={[required]}

                                    >
                                        {/* <option value="tip1">tip1</option>
                                        <option value="tip2">tip2</option> */}
                                        {this.props.diagnoses && this.props.diagnoses.map((item, idx) => {
                                            return (
                                                <option value={item._id}>{item.name}</option>
                                            )
                                        })}

                                    </Field>
                                </Col>

                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="medications"
                                        component={renderMultiSelect}
                                        label={"Recept"}
                                        placeholder="Izaberite lijekove"
                                        validate={[required]}
                                    >
                                        {this.props.medications && this.props.medications.map((item, idx) => {
                                            return (
                                                <option value={item._id} key={idx}>{item.name}</option>
                                            )
                                        })}

                                    </Field>
                                </Col>
                                <Col lg="7" className="input-wrap">
                                    <Field
                                        name="price"
                                        component={renderTextArea}
                                        label={"Izvjestaj"}
                                        placeholder="Unesite izvjestaj"
                                        validate={[required]}
                                    ></Field>
                                </Col>



                            </Row>
                        </Container>
                    </Col>

                    <Col lg="12">
                        <button className="button">Zavrsi pregled</button>

                    </Col>

                </Row>

            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)
