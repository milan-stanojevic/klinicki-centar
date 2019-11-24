import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import OrdinationForm from '../../components/forms/ordinationForm';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class Ordination extends Component {
    // constructor(props) {
    //     super(props);
    //     this.add = this.add.bind(this);
    //     this.state = {

    //     };
    // }
    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null
                }

                <Container fluid>

                    <Row className="page-title">
                        <Col lg="12">
                            {/* {this.props[0].match.params.id !== 'new' ? <h3>Izmjeni salu</h3> : <h3>Dodaj salu</h3>} */}
                            <h3>Dodaj salu</h3>
                        </Col>
                    </Row>
                    {/* {this.state.initialValues ?
                        <OrdinationForm initialValues={this.state.initialValues} onSubmit={this.add} />
                        :
                        <OrdinationForm onSubmit={this.add} />
                    }
                    {
                        this.state.error ?

                            <p>{this.state.error}</p>
                            :
                            null
                    } */}
                    <OrdinationForm></OrdinationForm>
                </Container>


            </div>
        );
    }
}

export default Page(Ordination)
