import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import Text from './fields/text';
import Select from './fields/select'

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


class form extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }

    }

    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        console.log(this.props);
        return (
            <form onSubmit={(data) => {
                this.setState({ showForm: true }); handleSubmit(data)
            }
            }>
                <Row>
                    <Col lg="12" >
                        <Container fluid className="form-box">
                            <Row>
                                <Col lg="12" className="input-wrap">
                                    <Field
                                        name="search"
                                        component={renderTextField}
                                        placeholder='Trazi . . . '
                                    ></Field>
                                </Col>

                                {this.state.showForm ?
                                    <>
                                        <Col lg="6" className="input-wrap">
                                            <Field
                                                name="pol"
                                                component={renderSelectField}
                                                placeholder="Izaberite pol"
                                            >
                                                <option value="1">Muski</option>
                                                <option value="2">Zenski</option>

                                            </Field>
                                        </Col>
                                        <Col lg="6" className="input-wrap">
                                            <Field
                                                name="email"
                                                component={renderTextField}
                                                placeholder="Unesite e-mail adresu"
                                            ></Field>
                                        </Col>
                                    </>
                                    : null
                                }
                                <Col lg="6">
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