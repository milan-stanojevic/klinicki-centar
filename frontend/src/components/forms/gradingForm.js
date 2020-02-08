import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import "react-datepicker/dist/react-datepicker.css";

import Text from './fields/text';
import Select from './fields/select';


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
        return (
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col lg="12" >
                        <Container fluid className="form-box">
                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="clinic"
                                        component={renderSelectField}
                                        placeholder="Izaberite kliniku"
                                        validate={[required]}
                                    >
                                         {this.props.clinics && this.props.clinics.map((item, idx) => {
                                            
                                            return (
                                                <option value={item._id}>{item.name}</option>
                                            )
                                        })}
                                    </Field>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="6" className="input-wrap">
                                    <Field
                                        name="ratingClinic"
                                        component={renderSelectField}
                                        placeholder="Ocenite kliniku"
                                        validate={[required]}
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>

                                    </Field>
                                </Col>
                            </Row>
                           
                        </Container>
                    </Col>

                    <Col lg="12">
                        <button className="button">Posalji</button>
                    </Col>

                </Row>

            </form>
        )
    }
}

export default reduxForm({
    form: 'form'  // a unique identifier for this form
})(form)